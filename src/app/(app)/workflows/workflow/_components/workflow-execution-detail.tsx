import { SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
};

export default function WorkflowExecutionDetail({ icon, label, value }: Props) {
  const Icon = icon;

  return (
    <SidebarMenuItem>
      <div className="ring-sidebar-ring flex w-full items-center justify-between gap-4 px-2 py-2 text-left text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Icon size={20} className="stroke-muted-foreground/80" />
          <span>{label}</span>
        </div>
        <span className="truncate font-semibold">{value}</span>
      </div>
    </SidebarMenuItem>
  );
}
