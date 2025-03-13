"use client";

import { useQuery } from "@tanstack/react-query";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { datesToDurationString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./execution-status-indicator";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import AnimatedCounter from "@/components/animated-counter";
import getAllWorkflowExecutionsServer from "../../_data-access/get-all-workflow-executions-server";
import getAllWorkflowExecutionsClient from "../../_data-access/get-all-workflow-executions-client";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionsTableBody({
  workflowId,
  initialData,
}: Props) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => getAllWorkflowExecutionsClient(workflowId),
    refetchInterval: (query) => {
      return query.state.data?.some(
        (execution) =>
          execution.status === "PENDING" || execution.status === "EXECUTING",
      )
        ? 1000
        : false;
    },
  });

  return (
    <TableBody>
      {query.data?.map((execution) => {
        const startedAtDate = execution.startedAt
          ? new Date(execution.startedAt)
          : null;
        const completedAtDate = execution.completedAt
          ? new Date(execution.completedAt)
          : null;
        const duration =
          datesToDurationString(startedAtDate, completedAtDate) || "-";
        const formattedStartedAt = startedAtDate
          ? formatDistanceToNow(startedAtDate, { addSuffix: true })
          : "-";
        return (
          <TableRow
            key={execution.workflowExecutionId}
            className="cursor-pointer"
            onClick={() =>
              router.push(
                `/workflow/execution/${workflowId}/${execution.workflowExecutionId}?task=${execution.tasks[0].taskId}`,
              )
            }
          >
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {execution.workflowExecutionId}
                </span>
                <div className="space-x-2 text-xs">
                  <span className="text-muted-foreground">Trigger</span>
                  <Badge variant="outline">{execution.trigger}</Badge>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="grid grid-cols-[calc(var(--spacing)*4)_1fr] grid-rows-2 items-center">
                <ExecutionStatusIndicator status={execution.status} />
                <span className="font-semibold">
                  {execution.status.split("_").join(" ")}
                </span>
                <span className="text-muted-foreground col-start-2 text-xs">
                  {duration}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="grid grid-cols-[calc(var(--spacing)*6)_1fr] grid-rows-2 items-center">
                <CoinsIcon
                  size={16}
                  className="stroke-primary dark:stroke-blue-500"
                />
                <span className="font-semibold">
                  {<AnimatedCounter value={execution.creditsConsumed ?? 0} />}
                </span>
                <span className="text-muted-foreground col-start-2 text-xs">
                  Credits
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">{formattedStartedAt}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
