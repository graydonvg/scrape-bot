import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { datesToDurationString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./execution-status-indicator";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import getAllWorkflowExecutionsClient from "../../_data-access/get-all-workflow-executions-client";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  workflowId: string;
  queryData: Awaited<ReturnType<typeof getAllWorkflowExecutionsClient>>;
};

export default function ExecutionsTableBody({ workflowId, queryData }: Props) {
  const router = useRouter();
  const { setWorkflowExecutionData } = useWorkflowsStore();

  return (
    <TableBody>
      {queryData?.workflowExecutions.map((execution) => {
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
              hanldeClick(
                execution.workflowExecutionId,
                execution.tasks[0].taskId,
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
                  {execution.creditsConsumed ?? "-"}
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

  function hanldeClick(workflowExecutionId: string, taskId: string) {
    setWorkflowExecutionData(null);

    router.push(
      `/workflow/execution/${workflowId}/${workflowExecutionId}?task=${taskId}`,
    );
  }
}
