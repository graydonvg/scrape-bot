import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <>
      <div className="bg-background z-50 flex h-16 items-center justify-between border-b-2 px-2">
        <div className="flex grow basis-2/4 items-center gap-4 truncate">
          <Skeleton className="size-8" />
          <div>
            <p className="font-bold">Workflow editor</p>
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex grow justify-end gap-1">
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      <div className="flex-center flex-1 flex-col px-4">
        <div className="flex items-center gap-2">
          <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
          <h1 className="text-xl md:text-3xl">Preparing your workflow...</h1>
        </div>
      </div>
    </>
  );
}
