import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full">
      <Skeleton className="min-h-screen w-[17rem] rounded-none" />
      <div className="flex grow flex-col">
        <Skeleton className="h-16 w-full rounded-none" />
        <div className="flex-center size-full">
          <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
        </div>
      </div>
    </div>
  );
}
