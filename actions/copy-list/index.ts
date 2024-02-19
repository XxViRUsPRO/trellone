"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CopyList } from "./schema";
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

  const { id, boardId } = data;

  let list;
  try {
    const list2Copy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          organizationId: orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!list2Copy) {
      return {
        error: "List not found",
      };
    }

    const count = await db.list.count({
      where: {
        boardId,
      },
    });

    list = await db.list.create({
      data: {
        title: `${list2Copy.title} - Copy`,
        boardId: list2Copy.boardId,
        order: count,
        cards: {
          createMany: {
            data: list2Copy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });

    await createAuditLog({
      objectId: list.id,
      objectType: ObjectType.LIST,
      objectName: list.title,
      actionType: ActionType.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const copyList = createSafeAction(CopyList, handler);
