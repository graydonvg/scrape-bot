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
  children: ReactNode;
};

export default function TooltipWrapper({
  tooltipContent,
  side,
  children,
}: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
