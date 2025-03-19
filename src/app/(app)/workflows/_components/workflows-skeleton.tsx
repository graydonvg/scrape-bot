import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-[100px] w-full border" />
      ))}
    </div>
  );
}
