"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateCard } from "./schema";
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

  const { title, boardId, listId } = data;

  let card;
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          organizationId: orgId,
        },
      },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    const count = await db.card.count({
      where: {
        listId,
      },
    });

    card = await db.card.create({
      data: {
        title,
        listId,
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
      error: "Error creating card",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const createCard = createSafeAction(CreateCard, handler);
