"use client";

import { updateCard } from "@/actions/update-card";
import FormSubmit from "@/components/form/form-submit";
import FormTextArea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

type Props = {
  data: CardWithList;
};

export const Description = ({ data }: Props) => {
  const params = useParams();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (newData) => {
      queryClient.invalidateQueries({
        queryKey: ["card", newData.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", newData.id],
      });

      toast.success({
        description: `Card "${data.title}" description has been updated!`,
      });
      exitEditMode();
    },
    onError: (error) => {
      toast.error({
        description: error,
      });
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  const enterEditMode = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const exitEditMode = () => {
    setEditing(false);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      exitEditMode();
    }
  };

  useEventListener("keydown", onKeyPress);
  useOnClickOutside(formRef, exitEditMode);

  const onSubmit = (formData: FormData) => {
    const id = data.id;
    const boardId = params.boardId as string;
    const description = formData.get("description") as string;

    if (description === data.description) {
      return exitEditMode();
    }

    execute({ id, boardId, description });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="w-5 h-5 mt-1" />
      <div className="w-full">
        <p className="font-semibold mb-2">Description</p>
        {!editing ? (
          <div
            role="button"
            className="min-h-[80px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            onClick={enterEditMode}
          >
            {data.description || "Add a more detailed description..."}
          </div>
        ) : (
          <form action={onSubmit} className="space-y-2">
            <FormTextArea
              id="description"
              defaultValue={data.description ?? undefined}
              placeholder="Add a more detailed description..."
              className="w-full mt-2"
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button variant="ghost" size="sm" onClick={exitEditMode}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function CardModalDescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-full h-20 mb-1 bg-neutral-200" />
      </div>
    </div>
  );
};
