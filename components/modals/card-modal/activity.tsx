"use client";

import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLogWithUser } from "@/types";
import { ActivityIcon } from "lucide-react";
import React from "react";

type Props = {
  data: AuditLogWithUser[];
};

export const Activity = ({ data }: Props) => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="h-5 w-5 mt-0.5" />
      <div className="w-full">
        <p className="font-semibold mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {data.map((log) => (
            <ActivityItem key={log.id} data={log} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function CardModalActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div>
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-10 w-full bg-neutral-200" />
      </div>
    </div>
  );
};
