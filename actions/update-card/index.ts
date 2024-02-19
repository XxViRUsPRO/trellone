"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateCard } from "./schema";
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

  const { id, boardId, ...values } = data;

  let card;
  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            id: boardId,
            organizationId: orgId,
          },
        },
      },
      data: {
        ...values,
      },
    });

    await createAuditLog({
      objectId: card.id,
      objectType: ObjectType.CARD,
      objectName: card.title,
      actionType: ActionType.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update card",
    };
  }

  revalidatePath(`/board/${id}`);
  return {
    data: card,
  };
};

export const updateCard = createSafeAction(UpdateCard, handler);
