import { Skeleton } from "@/components/ui/skeleton";

export default function CredentialsSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-[81.6px] w-full border" />
      ))}
    </div>
  );
}
