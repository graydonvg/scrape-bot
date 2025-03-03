import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
};

export default function ExecutionProgressMenuItem({
  icon,
  label,
  value,
}: Props) {
  const Icon = icon;

  return (
    <SidebarMenuItem>
      <div className="flex items-center justify-between px-4 py-2">
        {!value ? (
          <Skeleton className="bg-muted h-6 w-full" />
        ) : (
          <>
            <div className="text-muted-foreground flex items-center gap-2">
              <Icon size={20} className="stroke-muted-foreground/80" />
              <span>{label}</span>
            </div>
            <span className="flex items-center gap-2 font-semibold uppercase">
              {value}
            </span>
          </>
        )}
      </div>
    </SidebarMenuItem>
  );
}
