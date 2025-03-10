"use client";

import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <TooltipWrapper tooltipContent="Back">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="icon"
        className="shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-8"
      >
        <ChevronLeftIcon className="size-6 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-4" />
      </Button>
    </TooltipWrapper>
  );
}
