"use client";

import React, { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FormErrors from "./form-errors";

type Props = {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
} & InputProps;

const FormInput = forwardRef<HTMLInputElement, Props>(
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
          <Input
            {...rest}
            id={id}
            name={id}
            ref={ref}
            className={cn("text-sm px-2 py-1 h-7", className)}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
          />
          <FormErrors id={id} errors={errors} />
        </div>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default FormInput;
