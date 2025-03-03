import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  tooltipContent: ReactNode;
  side?: TooltipContentProps["side"];
  hidden?: boolean;
  children: ReactNode;
};

export default function TooltipWrapper({
  tooltipContent,
  side,
  hidden = false,
  children,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} hidden={hidden}>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
