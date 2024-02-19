"use client";

import React, { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import FormErrors from "./form-errors";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ id, label, className, errors, disabled, ...rest }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label && (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          )}
          <Textarea
            {...rest}
            id={id}
            name={id}
            ref={ref}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
          />
          <FormErrors id={id} errors={errors} />
        </div>
      </div>
    );
  }
);
FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
