"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import getAllWorkflowExecutionsServer from "../../_data-access/get-all-workflow-executions-server";
import getAllWorkflowExecutionsClient from "../../_data-access/get-all-workflow-executions-client";
import { columns } from "./columns";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { useRouter } from "next/navigation";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionsTable({ workflowId, initialData }: Props) {
  const router = useRouter();
  const { setSelectedTaskId } = useWorkflowsStore();
  const [newInitialData, setNewInitialData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "startedAt",
      desc: true,
    },
  ]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const query = useQuery({
    queryKey: ["executions", workflowId, pageIndex, pageSize, sorting],
    initialData: newInitialData,
    queryFn: () =>
      getAllWorkflowExecutionsClient({
        workflowId,
        pagination: { page: pageIndex, rows: pageSize },
        sorting,
      }),
    refetchInterval: (query) => {
      return query.state.data?.workflowExecutions.some(
        (execution) =>
          execution.status === "PENDING" || execution.status === "EXECUTING",
      )
        ? 1000
        : false;
    },
  });

  const workflowExecutions = query.data?.workflowExecutions ?? [];
  const rowCount = query.data?.count ?? 0;

  const table = useReactTable({
    data: workflowExecutions,
    columns,
    rowCount,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  useEffect(() => {
    // Update the initial data to prevent flashing the initialData from props
    // when fetching new data.
    setNewInitialData(query.data);
  }, [query.data]);

  return (
    <>
      {/* The outer <div>  applies the border radius and hides any overflow, ensuring that the scrollbar doesn't protrude beyond the rounded corners. */}
      <div className="relative flex max-h-[calc(100vh-204px)] min-h-[350px] w-full flex-1 flex-col overflow-hidden rounded-xl border">
        {/* The inner <div>  manages the scrolling functionality. */}
        <div className="w-full flex-1 overflow-auto">
          <Table>
            <TableHeader className="dark:bg-sidebar bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="first:pl-5 last:pr-5"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() =>
                      hanldeClick(
                        row.original.workflowExecutionId,
                        row.original.tasks[0].taskId,
                      )
                    }
                  >
                    {row.getAllCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="first:pl-5 last:w-min last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="dark:bg-sidebar bg-muted border-t p-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );

  function hanldeClick(workflowExecutionId: string, taskId: string) {
    setSelectedTaskId(taskId);

    router.push(
      `/workflows/workflow/${workflowId}/execution/${workflowExecutionId}`,
    );
  }
}
