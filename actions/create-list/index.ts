"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateList } from "./schema";
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

  const { title, boardId } = data;

  let list;
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        organizationId: orgId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const count = await db.list.count({
      where: {
        boardId,
      },
    });

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: count,
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
      error: "Failed to create list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const createList = createSafeAction(CreateList, handler);
