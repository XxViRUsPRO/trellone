"use client";

import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/form-submit";
import FormTextArea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { KeyboardEventHandler, forwardRef, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

type Props = {
  listId: string;
  editing: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;
};

const CardForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, editing, enterEditMode, exitEditMode }, ref) => {
    const params = useParams();
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: () => {
        toast.success({
          description: "Card has been created!",
        });
        exitEditMode();
      },
      onError: () => {
        toast.error({
          description: "Unable to create card",
        });
      },
    });

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exitEditMode();
      }
    };

    useEventListener("keydown", onEscape);
    useOnClickOutside(formRef, exitEditMode);

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = async (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      await execute({ title, listId, boardId });
    };

    if (editing) {
      return (
        <form action={onSubmit} ref={formRef} className="m-1 py-0.5 px-1">
          <input
            type="hidden"
            id="listId"
            name="listId"
            value={listId}
            readOnly
          />
          <FormTextArea
            ref={ref}
            id="title"
            placeholder="Enter a title for this card..."
            errors={fieldErrors}
            onKeyDown={onTextAreaKeyDown}
          />
          <div className="flex items-center gap-x-1 mt-4">
            <FormSubmit>Add card</FormSubmit>
            <Button variant="ghost" size="icon" onClick={exitEditMode}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto w-full text-sm text-muted-foreground justify-start px-2 py-1.5"
          onClick={enterEditMode}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);
CardForm.displayName = "CardForm";

export default CardForm;
