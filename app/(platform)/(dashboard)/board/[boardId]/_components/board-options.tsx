"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { AlertTriangle, MoreHorizontal, X } from "lucide-react";
import React from "react";

type Props = { id: string };

const BoardOptions = ({ id }: Props) => {
  const { toast } = useToast();
  const { execute, loading } = useAction(deleteBoard, {
    onError(error) {
      toast({
        title: (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Something went wrong</span>
          </div>
        ) as any,
        description: error,
        variant: "destructive",
      });
    },
  });

  const onDeleteBoard = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="absolute w-auto h-auto p-2 top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          onClick={onDeleteBoard}
          disabled={loading}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
