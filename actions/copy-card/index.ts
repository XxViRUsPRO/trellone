"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CopyCard } from "./schema";
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

  let card;
  try {
    const card2Copy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            organizationId: orgId,
          },
        },
      },
    });

    if (!card2Copy) {
      return {
        error: "Card not found",
      };
    }

    const count = await db.card.count({
      where: {
        listId: card2Copy.listId,
      },
    });

    card = await db.card.create({
      data: {
        title: `${card2Copy.title} - Copy`,
        description: card2Copy.description,
        listId: card2Copy.listId,
        order: count,
      },
    });

    await createAuditLog({
      objectId: card.id,
      objectType: ObjectType.CARD,
      objectName: card.title,
      actionType: ActionType.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy card",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const copyCard = createSafeAction(CopyCard, handler);
