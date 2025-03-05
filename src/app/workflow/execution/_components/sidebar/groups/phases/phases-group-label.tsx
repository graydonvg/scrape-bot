import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { CopyMinusIcon, CopyPlusIcon, ListOrdered } from "lucide-react";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";

type Props = {
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

export default function PhasesGroupLabel({
  onCollapseAll,
  onExpandAll,
}: Props) {
  return (
    <SidebarGroupLabel className="text-muted-foreground relative text-base">
      <div className="absolute-center flex items-center gap-2">
        <ListOrdered size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Phases</span>
      </div>
      <div className="ml-auto flex items-center opacity-0 transition-opacity duration-200 ease-linear group-hover/phases:opacity-100">
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
    </SidebarGroupLabel>
  );
}
