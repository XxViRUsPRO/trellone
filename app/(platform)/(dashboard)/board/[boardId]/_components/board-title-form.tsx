"use client";

import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import FormInput from "@/components/form/form-input";
import React, { useRef, useState } from "react";
import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/update-board";
import { useToast } from "@/components/ui/use-toast";
import { Edit3 } from "lucide-react";

type Props = {
  data: Board;
};

const BoardTitleForm = ({ data }: Props) => {
  const [title, setTitle] = useState(data.title);
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { execute } = useAction(updateBoard, {
    onSuccess: (newData) => {
      toast.success({
        description: `Board "${data.title}" title has been updated!`,
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

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    if (title === data.title || title === "") {
      return exitEditMode();
    }

    execute({ id: data.id, title });
  };

  if (editing)
    return (
      <div className="relative flex items-center px-2 py-1 border-2 rounded-md w-36 focus-within:w-64 transition-all delay-0">
        <form action={onSubmit} ref={formRef}>
          <FormInput
            id="title"
            onBlur={onBlur}
            defaultValue={title}
            className="text-lg font-bold h-7 px-2 py-1 bg-transparent border-none focus-visible:outline-none 
          focus-visible:ring-offset-0 focus-visible:ring-transparent"
            ref={inputRef}
          />
        </form>
        <Edit3 className="absolute right-2 w-5 h-5" />
      </div>
    );

  return (
    <Button
      onClick={enterEditMode}
      variant="transparent"
      className="text-lg font-bold h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
