import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ObjectType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      cardId: string;
    };
  }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        objectId: params.cardId,
        objectType: ObjectType.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      include: {
        user: true,
      },
    });

    return NextResponse.json(auditLogs);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
