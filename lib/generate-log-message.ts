import { AuditLogWithUser } from "@/types";
import { ActionType } from "@prisma/client";

export const generateLogMessage = (log: AuditLogWithUser) => {
  const { user, actionType, objectType, objectName } = log;

  switch (actionType) {
    case ActionType.CREATE:
      return `created a ${objectType.toLowerCase()} "${objectName}"`;
    case ActionType.UPDATE:
      return `updated a ${objectType.toLowerCase()} "${objectName}"`;
    case ActionType.DELETE:
      return `deleted a ${objectType.toLowerCase()} "${objectName}"`;
    default:
      return "unknown action";
  }
};
