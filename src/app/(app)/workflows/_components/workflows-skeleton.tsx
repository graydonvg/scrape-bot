import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-[129.6px] w-full border" />
      ))}
    </div>
  );
}
