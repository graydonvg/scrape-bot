import { CopyMinusIcon, CopyPlusIcon } from "lucide-react";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";

type Props = {
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

export default function TasksGroupLabel({ onExpandAll, onCollapseAll }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs">Tasks</span>
      <div className="flex items-center opacity-0 transition-opacity duration-200 ease-linear group-hover/tasks:opacity-100">
        <TooltipWrapper tooltipContent="Expand all">
          <Button onClick={onExpandAll} variant="ghost" className="size-6">
            <CopyPlusIcon />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper tooltipContent="Collaspe all">
          <Button onClick={onCollapseAll} variant="ghost" className="size-6">
            <CopyMinusIcon />
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
}
