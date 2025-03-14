import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex grow flex-col">
      <Skeleton className="bg-sidebar flex h-16 shrink-0 items-center rounded-none border-b group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" />

      <div className="flex-center size-full grow">
        <div className="container">
          <div className="rounded-xl border">
            <div className="flex h-[calc(100vh-194.3px)] flex-col justify-between">
              <div className="space-y-1 divide-y">
                <Skeleton className="h-10 w-full rounded-b-none" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[62px] w-full rounded-none" />
                ))}
              </div>
              <Skeleton className="h-[52px] w-full rounded-t-none border-t" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
