"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateListOrder } from "./schema";
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

  let lists;
  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          boardId,
          board: {
            organizationId: orgId,
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    lists = await db.$transaction(transaction);

    if (!lists) {
      return {
        error: "List not found",
      };
    }
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: lists,
  };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
