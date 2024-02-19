import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const increaseBoardsCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { organizationId: orgId },
      data: { count: { increment: 1 } },
    });
  } else {
    await db.orgLimit.create({
      data: { organizationId: orgId, count: 1 },
    });
  }
};

export const decreaseBoardsCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { organizationId: orgId },
      data: { count: { decrement: 1 } },
    });
  } else {
    throw new Error("Organization limit not found");
  }
};

export const getBoardsCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { organizationId: orgId },
  });

  return orgLimit?.count || 0;
};

export const canCreateBoard = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const count = await getBoardsCount();

  if (count < MAX_FREE_BOARDS) {
    return true;
  }

  return false;
};
