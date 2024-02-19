"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ActionType, ObjectType } from "@prisma/client";

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

  const { id, title } = data;

  let board;
  try {
    board = await db.board.update({
      where: {
        id,
        organizationId: orgId,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      objectId: board.id,
      objectType: ObjectType.BOARD,
      objectName: board.title,
      actionType: ActionType.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }

  revalidatePath(`/board/${id}`);
  return {
    data: board,
  };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
