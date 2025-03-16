import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailsSkeleton() {
  return (
    <div className="container flex flex-col gap-4">
      <PageHeader
        title="Task Details"
        subtitle="Details for the executed task"
        containerClassName="mb-6"
      />
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
