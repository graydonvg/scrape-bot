import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex grow flex-col">
      <Skeleton className="bg-sidebar flex h-16 shrink-0 items-center rounded-none border-b group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" />

      <div className="flex-center size-full">
        <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
      </div>
    </div>
  );
}
