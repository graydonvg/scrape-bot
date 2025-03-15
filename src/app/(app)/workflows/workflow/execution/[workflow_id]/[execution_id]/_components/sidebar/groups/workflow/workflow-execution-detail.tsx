import TooltipWrapper from "@/components/tooltip-wrapper";
import { SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
};

export default function WorkflowExecutionDetail({ icon, label, value }: Props) {
  const { state, isMobile } = useSidebar();
  const Icon = icon;

  return (
    <TooltipWrapper
      tooltipContent={`${label}: ${value}`}
      side="right"
      hidden={state !== "collapsed" || isMobile}
    >
      <SidebarMenuItem>
        <div className="peer/menu-button ring-sidebar-ring flex w-full items-center justify-between overflow-hidden px-4 py-2 text-left text-sm outline-hidden transition-[width,height,padding] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:px-2! [&>svg]:size-4 [&>svg]:shrink-0">
          <div className="text-muted-foreground flex items-center gap-2">
            <Icon size={20} className="stroke-muted-foreground/80" />
            <span className="truncate">{label}</span>
          </div>
          <span className="flex items-center gap-2 truncate font-semibold">
            {value}
          </span>
        </div>
      </SidebarMenuItem>
    </TooltipWrapper>
  );
}
