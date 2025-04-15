"use client";

import { datesToDurationString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import getAllWorkflowExecutionsServer from "../../_data-access/get-all-workflow-executions-server";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "@/components/execution-status-indicator";
import { CoinsIcon } from "lucide-react";

type Payment = Exclude<
  Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>,
  null
>["workflowExecutions"][number];

export const columns: ColumnDef<Payment>[] = [
  {
    id: "workflowExecutionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const workflowExecutionId = row.original.workflowExecutionId;
      const trigger = row.original.trigger;

      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{workflowExecutionId}</span>
          <div className="space-x-2 text-xs">
            <span className="text-muted-foreground">Trigger</span>
            <Badge variant="outline">{trigger}</Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const startedAtDate = new Date(row.original.startedAt);
      const completedAtDate = row.original.completedAt
        ? new Date(row.original.completedAt)
        : null;
      const duration =
        datesToDurationString(startedAtDate, completedAtDate) || "-";

      return (
        <div className="grid grid-cols-[calc(var(--spacing)*4)_1fr] grid-rows-2 items-center">
          <ExecutionStatusIndicator status={status} />
          <span className="font-semibold">{status.split("_").join(" ")}</span>
          <span className="text-muted-foreground col-start-2 text-xs">
            {duration}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "creditsConsumed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Consumed" />
    ),
    cell: ({ row }) => {
      const creditsConsumed = row.original.creditsConsumed;

      return (
        <div className="grid grid-cols-[calc(var(--spacing)*6)_1fr] grid-rows-2 items-center">
          <CoinsIcon
            size={16}
            className="stroke-primary dark:stroke-blue-500"
          />
          <span className="font-semibold">{creditsConsumed ?? "-"}</span>
          <span className="text-muted-foreground col-start-2 text-xs">
            Credits
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Started at"
        className="-mr-3 justify-end"
      />
    ),
    cell: ({ row }) => {
      const formattedStartedAt = formatDistanceToNow(row.original.startedAt, {
        addSuffix: true,
      });

      return <div className="text-right">{formattedStartedAt}</div>;
    },
  },
];
