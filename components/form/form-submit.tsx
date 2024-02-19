import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {} & ButtonProps;

const FormSubmit = ({
  className,
  variant,
  children,
  disabled,
  ...rest
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      {...rest}
      className={cn(className)}
      variant={variant || "primary"}
      disabled={pending || disabled}
    >
      {children}
    </Button>
  );
};

export default FormSubmit;
