import { auth, currentUser } from "@clerk/nextjs";
import { ActionType, ObjectType } from "@prisma/client";
import { db } from "./db";

interface Props {
  actionType: ActionType;
  objectId: string;
  objectType: ObjectType;
  objectName: string;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("OrgId or User not found");
    }

    const { actionType, objectId, objectType, objectName } = props;

    await db.auditLog.create({
      data: {
        organizationId: orgId,
        actionType,
        objectId,
        objectType,
        objectName,
        userId: user.id,
      },
    });
  } catch (e) {
    console.error("[AUDIT_LOG_ERROR]", e);
  }
};
