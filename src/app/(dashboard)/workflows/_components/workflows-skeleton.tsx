import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[100px] w-full" />
      ))}
    </div>
  );
}
