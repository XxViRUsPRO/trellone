import { generateLogMessage } from "@/lib/generate-log-message";
import { AuditLogWithUser } from "@/types";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";

type Props = {
  data: AuditLogWithUser;
};

export const ActivityItem = ({ data }: Props) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.user.pfpUrl} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {data.user.name}
          </span>
          &nbsp;
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};
