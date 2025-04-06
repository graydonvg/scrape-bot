"use client";

import Link from "next/link";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getUserAvailableCredits from "@/data-access/get-user-available-credits";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { cn } from "@/lib/utils";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/animated-counter";
import { useEffect } from "react";
import useUserStore from "@/lib/store/user-store";

export default function AvailableCredits() {
  const { setUserCreditBalance } = useUserStore();
  const { workflowExecutionStatus } = useWorkflowsStore();
  const query = useQuery({
    queryKey: ["available-credits"],
    queryFn: () => getUserAvailableCredits(),
    refetchInterval: () =>
      workflowExecutionStatus === "EXECUTING" ? 1000 : false,
  });

  useEffect(() => {
    if (query.data?.availableCredits)
      setUserCreditBalance(query.data?.availableCredits);
  }, [query.data?.availableCredits, setUserCreditBalance]);

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
                "text-destructive": query.data.availableCredits === 0,
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
