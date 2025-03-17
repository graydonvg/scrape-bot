"use client";

import Link from "next/link";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getUserAvailableCredits from "@/data-access/get-user-available-credits";
import AnimatedCounter from "./animated-counter";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { Button } from "./ui/button";
import TooltipWrapper from "./tooltip-wrapper";

export default function AvailableCredits() {
  const { workflowExecutionStatus } = useWorkflowsStore();
  const query = useQuery({
    queryKey: ["available-credits"],
    queryFn: () => getUserAvailableCredits(),
    refetchInterval: () =>
      workflowExecutionStatus === "EXECUTING" ? 1000 : false,
  });

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
            <span className="font-semibold">
              <AnimatedCounter value={query.data.credits} />
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
