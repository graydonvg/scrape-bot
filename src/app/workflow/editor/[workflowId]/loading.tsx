import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-center flex-1 flex-col">
      <Loader2Icon size={30} className="stroke-primary animate-spin" />
    </div>
  );
}
