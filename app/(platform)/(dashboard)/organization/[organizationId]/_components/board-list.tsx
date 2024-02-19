import FormPopover from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getBoardsCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const availableBoards = await getBoardsCount();
  const isPro = await checkSubscription();

  const boards = await db.board.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      boardImage: {
        select: {
          thumbUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="w-6 h-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            style={{
              backgroundImage: `url(${board.boardImage?.thumbUrl})`,
            }}
            className="aspect-video relative bg-no-repeat bg-center bg-cover bg-main rounded-sm h-full w-full p-2 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro
                ? "Unlimited"
                : `${MAX_FREE_BOARDS - availableBoards} remaining`}
            </span>
            <Hint
              content="You can create up to 5 boards for free. Upgrade to create more."
              sideOffset={45}
            >
              <HelpCircle className="absolute right-2 bottom-2 w-4 h-4 text-neutral-500" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};

export default BoardList;
