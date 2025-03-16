import { Separator } from "@/components/ui/separator";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListCollapseIcon, Loader2Icon, NetworkIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 top-12 flex grow">
      <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:ml-12 md:w-[320px] md:max-w-[320px] md:min-w-[320px]">
        <div className="h-[224px] space-y-2 p-4">
          <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
            <NetworkIcon
              size={20}
              className="stroke-muted-foreground/80 -rotate-90"
            />
            <span className="font-semibold">Workflow</span>
          </SidebarGroupLabel>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="bg-accent h-[calc(20%-(var(--spacing)*1))] w-full"
            />
          ))}
        </div>
        <Separator />
        <div className="grow space-y-2 p-4">
          <SidebarGroupLabel className="text-muted-foreground text-base">
            <div className="flex-center w-full gap-2">
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
        <Separator />
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
