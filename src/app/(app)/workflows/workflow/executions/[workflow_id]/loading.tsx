import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex h-[60px] flex-col gap-2">
        <Skeleton className="h-2/3 w-[250px]" />
        <Skeleton className="h-1/3 w-[283.5px]" />
      </div>

      <div className="flex h-[calc(100vh-222.3px)] flex-col justify-between transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100vh-206.3px)]">
        <div className="space-y-1 divide-y">
          <Skeleton className="bg-sidebar h-10 w-full rounded-t-xl rounded-b-none" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[62px] w-full rounded-none" />
          ))}
        </div>
        <Skeleton className="bg-sidebar h-[52px] w-full rounded-t-none rounded-b-xl border-t" />
      </div>
    </div>
  );
}
