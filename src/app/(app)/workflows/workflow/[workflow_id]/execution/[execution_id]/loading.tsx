import { Separator } from "@/components/ui/separator";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListOrderedIcon, Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 top-12 flex flex-1">
      <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:ml-12 md:w-[320px] md:max-w-[320px] md:min-w-[320px]">
        <div className="flex h-[304px] flex-col space-y-2 p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="bg-accent h-full w-full" />
          ))}
        </div>
        <Separator />
        <div className="grow space-y-2 p-4">
          <SidebarGroupLabel className="text-muted-foreground text-base">
            <div className="flex-center w-full gap-2">
              <ListOrderedIcon
                size={20}
                className="stroke-muted-foreground/80"
              />
              <span className="font-semibold">Phases</span>
            </div>
          </SidebarGroupLabel>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="bg-accent h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-center size-full">
        <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
      </div>
    </div>
  );
}
