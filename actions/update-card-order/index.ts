"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateCardOrder } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

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

  const { items, boardId } = data;

  let cards;
  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            boardId,
            board: {
              organizationId: orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    cards = await db.$transaction(transaction);

    if (!cards) {
      return {
        error: "Card not found",
      };
    }
  } catch (error) {
    return {
      error: "Failed to update card order",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: cards,
  };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
