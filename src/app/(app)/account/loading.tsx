import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Account Settings" />
      <div className="space-y-8">
        <Skeleton className="h-[190px] w-full" />
        <Skeleton className="h-[248px] w-full" />
        <Skeleton className="h-[410px] w-full" />
        <Skeleton className="h-[182px] w-full" />
      </div>
    </div>
  );
}
