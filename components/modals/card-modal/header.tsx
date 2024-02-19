"use client";

import { updateCard } from "@/actions/update-card";
import FormInput from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef } from "react";

type Props = {
  data: CardWithList;
};

export const Header = ({ data }: Props) => {
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
        description: `Card "${data.title}" title has been updated!`,
      });
    },
    onError: (error) => {
      toast.error({
        description: error,
      });
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const id = data.id;
    const boardId = params.boardId as string;
    const title = formData.get("title") as string;

    if (title === data.title || title === "") {
      inputRef.current!.value = data.title;
      return;
    }

    execute({ id, boardId, title });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="w-5 h-5 mt-1" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            id="title"
            ref={inputRef}
            defaultValue={data.title}
            className="font-semibold text-xl px-1 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-2 truncate"
            errors={fieldErrors}
            onBlur={onBlur}
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list&nbsp;
          <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function CardModalHeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-6 mb-1 bg-neutral-200" />
      </div>
    </div>
  );
};
