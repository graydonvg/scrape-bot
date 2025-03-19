import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailsSkeleton() {
  return (
    <div className="container flex flex-col gap-4">
      <div className="mb-6 flex h-[60px] flex-col gap-2 py-1">
        <Skeleton className="h-2/3 w-[250px]" />
        <Skeleton className="h-1/3 w-[90px]" />
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[28px] w-[100px] rounded-full" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
      ))}
      <Skeleton />
    </div>
  );
}
