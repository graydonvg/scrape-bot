import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex min-h-screen w-full">
      <div className="bg-sidebar h-full w-[300px] min-w-[348px] border-r" />
      <div className="flex-center size-full">
        <Loader2Icon className="stroke-primary size-[20px] animate-spin md:size-[30px]" />
      </div>
    </div>
  );
}
