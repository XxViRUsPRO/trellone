"use client";

import React, { useRef } from "react";
import { List } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import FormSubmit from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";

type Props = {
  data: List;
  onAddCard: () => void;
};

const ListOptions = ({ data, onAddCard }: Props) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { toast } = useToast();
  const { execute: executeCopyList } = useAction(copyList, {
    onSuccess: () => {
      toast.success({ description: "Your list has been copied." });
      closeRef.current?.click();
    },
    onError(error) {
      toast.error({
        description: error,
      });
    },
  });

  const { execute: executeDeleteList } = useAction(deleteList, {
    onSuccess: () => {
      toast.success({
        description: "Your list has been deleted successfully.",
      });
      closeRef.current?.click();
    },
    onError(error) {
      toast.error({
        description: error,
      });
    },
  });

  const onCopyList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopyList({ id, boardId });
  };

  const onDeleteList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDeleteList({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto px-2 py-1.5">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="absolute w-auto h-auto p-2 top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form action={onAddCard}>
          <input type="hidden" name="id" value={data.id} readOnly />
          <input type="hidden" name="boardId" value={data.boardId} readOnly />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Add a card
          </FormSubmit>
        </form>
        <form action={onCopyList}>
          <input type="hidden" name="id" value={data.id} readOnly />
          <input type="hidden" name="boardId" value={data.boardId} readOnly />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDeleteList}>
          <input type="hidden" name="id" value={data.id} readOnly />
          <input type="hidden" name="boardId" value={data.boardId} readOnly />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
