"use client";

import React, { useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { Info, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import FormPicker from "./form-picker";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

type Props = {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
  align?: "start" | "center" | "end";
};

const FormPopover = ({
  children,
  side = "bottom",
  sideOffset = 0,
  align,
}: Props) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const open = useProModal((state) => state.open);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success({
        description: "Your new board has been created.",
      });
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex items-center space-x-2">
            <Info className="w-6 h-6 text-orange-500" />
            <span>Free tier limit reached!</span>
          </div>
        ) as any,
        description: error,
      });
      open();
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="w-80 pt-3"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="absolute w-auto h-auto p-2 top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              placeholder="My new board"
              className="mb-4"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default FormPopover;
