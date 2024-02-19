"use client";

import React from "react";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  isPro: boolean;
}

export const Info = ({ isPro }: Props) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <Info.Skeleton />;
  }

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-16 h-16 relative">
        <Image
          src={organization?.imageUrl ?? ""}
          alt={organization?.name ?? ""}
          className="rounded-md object-cover"
          fill
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl">{organization?.name ?? ""}</p>
        <div
          className={cn(
            "flex items-center text-xs text-muted-foreground",
            isPro && "text-orange-400"
          )}
        >
          <CreditCard className="h-3 w-3 mr-1" />
          <span>{isPro ? "Pro" : "Free"}</span>
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-16 h-16 relative">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-52 h-10" />
        <div className="flex items-center">
          <Skeleton className="w-4 h-4 mr-2" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
    </div>
  );
};
