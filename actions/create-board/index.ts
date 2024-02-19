"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ActionType, ObjectType } from "@prisma/client";
import { canCreateBoard, increaseBoardsCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: DataType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  if (!orgId) {
    return {
      error: "Organization not found",
    };
  }

  const canCreate = await canCreateBoard();
  const isPro = await checkSubscription();

  if (!canCreate && !isPro) {
    return {
      error:
        "You have reached the limit of free boards, please upgrade your plan to create more boards.",
    };
  }

  const { title, image } = data;

  const [imageId, imageThumb, imageFull, imageLinkHtml, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumb ||
    !imageFull ||
    !imageLinkHtml ||
    !imageUserName
  ) {
    return {
      error: "Invalid image",
    };
  }

  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        organizationId: orgId,
        boardImage: {
          create: {
            imageId: imageId,
            thumbUrl: imageThumb,
            fullUrl: imageFull,
            linkHtml: imageLinkHtml,
            userName: imageUserName,
          },
        },
      },
    });

    if (!isPro) {
      await increaseBoardsCount();
    }

    await createAuditLog({
      objectId: board.id,
      objectType: ObjectType.BOARD,
      objectName: board.title,
      actionType: ActionType.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return {
    data: board,
  };
};

export const createBoard = createSafeAction(CreateBoard, handler);
