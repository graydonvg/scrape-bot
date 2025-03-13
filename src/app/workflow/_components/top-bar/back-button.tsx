import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function BackButton() {
  return (
    <TooltipWrapper tooltipContent="Back to workflows">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-8"
      >
        <Link href="/workflows">
          <ChevronLeftIcon className="size-6 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-4" />
        </Link>
      </Button>
    </TooltipWrapper>
  );
}
