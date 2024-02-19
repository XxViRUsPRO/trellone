"use server";

import { auth } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateList } from "./schema";
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

  const { id, title, boardId } = data;

  let list;
  try {
    list = await db.list.update({
      where: {
        id,
        boardId: boardId,
        board: {
          organizationId: orgId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      objectId: list.id,
      objectType: ObjectType.LIST,
      objectName: list.title,
      actionType: ActionType.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const updateList = createSafeAction(UpdateList, handler);
