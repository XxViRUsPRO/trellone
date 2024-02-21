import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import React from "react";
import BoardNavbar from "./_components/board-navbar";

type Props = {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
};

export const generateMetadata = async ({ params: { boardId } }: Props) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      organizationId: orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return {
    title: board.title || "Board",
  };
};

const BoardIdLayout = async ({ children, params: { boardId } }: Props) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      organizationId: orgId,
    },
    include: {
      boardImage: {
        select: {
          fullUrl: true,
        },
      },
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${board.boardImage?.fullUrl})`,
      }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      <main className="pt-32 max-w-6xl 2xl:max-w-screen-xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default BoardIdLayout;
