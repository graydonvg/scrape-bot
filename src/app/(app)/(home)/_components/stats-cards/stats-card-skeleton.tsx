import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCardSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="col-span-3 h-[120px] w-full lg:col-span-1"
        />
      ))}
    </>
  );
}
