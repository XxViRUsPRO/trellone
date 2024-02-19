"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  data: CardWithList;
};

export const Actions = ({ data }: Props) => {
  const params = useParams();

  const { toast } = useToast();
  const cardModal = useCardModal();
  const { execute: executeCopyCard, loading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: () => {
        toast.success({ description: "Your card has been copied." });
        cardModal.close();
      },
      onError(error) {
        toast.error({
          description: error,
        });
      },
    }
  );

  const { execute: executeDeleteCard, loading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success({
          description: "Your card has been deleted successfully.",
        });
        cardModal.close();
      },
      onError(error) {
        toast.error({
          description: error,
        });
      },
    }
  );

  const onCopyCard = () => {
    const boardId = params.boardId as string;

    executeCopyCard({ id: data.id, boardId });
  };

  const onDeleteCard = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({ id: data.id, boardId });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        onClick={onCopyCard}
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4 mr-1" />
        Copy
      </Button>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        onClick={onDeleteCard}
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function CardModalActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
