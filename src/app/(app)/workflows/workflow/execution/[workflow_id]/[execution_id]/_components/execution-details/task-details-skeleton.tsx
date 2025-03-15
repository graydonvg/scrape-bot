import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailsSkeleton() {
  return (
    <div className="container flex flex-col gap-4">
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
