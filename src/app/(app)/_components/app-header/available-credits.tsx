"use client";

import Link from "next/link";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getUserAvailableCredits from "@/data-access/get-user-available-credits";
import AnimatedCounter from "../../../../components/animated-counter";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { Button } from "../../../../components/ui/button";
import TooltipWrapper from "../../../../components/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AvailableCredits() {
  const { workflowExecutionStatus, editorWorkflowCreditCost } =
    useWorkflowsStore();
  const query = useQuery({
    queryKey: ["available-credits"],
    queryFn: () => getUserAvailableCredits(),
    refetchInterval: () =>
      workflowExecutionStatus === "EXECUTING" ? 1000 : false,
  });
  const pathname = usePathname();
  const isEditorPath = pathname.includes("/editor");

  return (
    <TooltipWrapper tooltipContent="Available credits">
      <Button variant="outline" asChild className="bg-background" size="sm">
        <Link
          href="/billing"
          className="flex items-center justify-center group-data-[collapsible=icon]:justify-start"
        >
          <CoinsIcon
            size={20}
            className="stroke-sidebar-primary dark:stroke-blue-500"
          />
          {query.isLoading && (
            <Loader2Icon size={20} className="animate-spin" />
          )}
          {!query.isLoading && query.data && (
            <span
              className={cn("text-side font-semibold", {
                "text-destructive":
                  isEditorPath &&
                  query.data.availableCredits < editorWorkflowCreditCost,
              })}
            >
              <AnimatedCounter value={query.data.availableCredits} />
            </span>
          )}
          {!query.isLoading &&
            (query.data === undefined || query.data === null) &&
            "-"}
        </Link>
      </Button>
    </TooltipWrapper>
  );
}
