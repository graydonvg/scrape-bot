import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListCollapseIcon, Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1">
      <div className="bg-sidebar flex h-full w-[320px] max-w-[320px] min-w-[320px] flex-col divide-y border-r">
        <div className="flex h-[232.8px] flex-col space-y-2 p-4">
          <Skeleton className="bg-accent mb-4 h-full w-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="bg-accent h-full w-full" />
          ))}
          <Skeleton className="bg-accent mt-2 h-full w-full" />
        </div>
        <div className="flex-1 space-y-2 p-4">
          <SidebarGroupLabel className="text-muted-foreground px-0 text-base">
            <div className="flex items-center gap-2">
              <ListCollapseIcon
                size={20}
                className="stroke-muted-foreground/80"
              />
              <span className="font-semibold">Tasks</span>
            </div>
          </SidebarGroupLabel>
          <Skeleton className="bg-accent h-9 w-full" />
          <div className="space-y-2 px-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="bg-accent h-9 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-2 p-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="bg-accent h-9 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-center size-full">
        <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
      </div>
    </div>
  );
}
