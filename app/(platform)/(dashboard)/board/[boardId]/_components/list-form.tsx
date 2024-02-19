"use client";

import React, { useRef, useState } from "react";
import ListWrapper from "./list-wrapper";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import FormInput from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { useParams, useRouter } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

const ListForm = ({}: Props) => {
  const router = useRouter();
  const params = useParams();

  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enterEditMode = () => {
    setEditing(true);
    console.log("editing");
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const exitEditMode = () => {
    setEditing(false);
  };

  const { toast } = useToast();
  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: () => {
      toast.success({
        description: "Your new list has been created.",
      });
      exitEditMode();
      router.refresh();
    },
    onError: (error) => {
      toast.error({
        description: error,
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

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    await execute({ title, boardId });
  };

  if (editing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-light space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            id="title"
            errors={fieldErrors}
            placeholder="Enter list title..."
            className="font-medium py-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
          />
          <input type="hidden" name="boardId" value={params.boardId} readOnly />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button variant="ghost" size="icon" onClick={exitEditMode}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <Button
        variant="secondary"
        size="lg"
        className="w-full justify-start bg-light hover:bg-light/80 shadow-md"
        onClick={enterEditMode}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a list
      </Button>
    </ListWrapper>
  );
};

export default ListForm;
