import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  children: React.ReactNode;
  content: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
};

const Hint = ({
  children,
  content,
  side = "bottom",
  sideOffset = 0,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className="text-xs max-w-[208px] break-words"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
