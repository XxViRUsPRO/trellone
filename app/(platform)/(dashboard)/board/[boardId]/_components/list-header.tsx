"use client";

import React, { useRef, useState } from "react";
import { List } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { AlertTriangle, CheckCircle2, Edit3 } from "lucide-react";
import FormInput from "@/components/form/form-input";
import { useEventListener } from "usehooks-ts";
import { updateList } from "@/actions/update-list";
import ListOptions from "./list-options";

type Props = {
  data: List;
  onAddCard: () => void;
};

const ListHeader = ({ data, onAddCard }: Props) => {
  const [title, setTitle] = useState(data.title);
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { execute } = useAction(updateList, {
    onSuccess: (newData) => {
      toast.success({
        description: `List "${data.title}" title has been updated!`,
      });
      setTitle(newData.title);
      exitEditMode();
    },
    onError: (error) => {
      toast.error({
        description: error,
      });
    },
  });

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

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      exitEditMode();
    }
  };

  useEventListener("keydown", onEscape);

  const onSubmit = (formData: FormData) => {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title || title === "") {
      return exitEditMode();
    }

    execute({ id, title, boardId });
  };

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2 group/form">
      {editing ? (
        <>
          <form action={onSubmit} className="flex-1 relative" ref={formRef}>
            <FormInput
              ref={inputRef}
              id="title"
              placeholder="Enter list title..."
              onBlur={onBlur}
              defaultValue={title}
              className="mt-0.5 text-sm h-6 font-medium bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute mx-auto inset-x-0 -bottom-0.5 h-px bg-black w-0 group-focus-within/form:w-[95%] transition-all delay-0" />
            <input type="hidden" id="id" name="id" value={data.id} readOnly />
            <input
              type="hidden"
              id="boardId"
              name="boardId"
              value={data.boardId}
              readOnly
            />
          </form>
          <Edit3 className="opacity-0 translate-y-3 group-focus-within/form:opacity-100 group-focus-within/form:translate-y-0 transition delay-0 w-5 h-5 self-center" />
        </>
      ) : (
        <div
          onClick={enterEditMode}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
};

export default ListHeader;
