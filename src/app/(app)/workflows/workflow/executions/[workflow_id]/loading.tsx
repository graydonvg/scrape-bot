import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="mr-6 flex shrink-0 flex-col">
          <h1 className="text-3xl font-bold">Executions</h1>
          <p className="text-muted-foreground">
            A list of all the workflow&apos;s executions
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-222.3px)] flex-col justify-between transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100vh-206.3px)]">
        <div className="space-y-1 divide-y">
          <Skeleton className="bg-muted h-10 w-full rounded-t-xl rounded-b-none" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[62px] w-full rounded-none" />
          ))}
        </div>
        <Skeleton className="bg-muted h-[52px] w-full rounded-t-none rounded-b-xl border-t" />
      </div>
    </div>
  );
}
