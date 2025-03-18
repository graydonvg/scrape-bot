"use client";

import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import getAllWorkflowExecutionsServer from "../../_data-access/get-all-workflow-executions-server";
import ExecutionsTableBody from "./executions-table-body";
import ExecutionsTableFooter from "./executions-table-footer";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getAllWorkflowExecutionsClient from "../../_data-access/get-all-workflow-executions-client";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionsTable({ workflowId, initialData }: Props) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const range = calculateQueryRage();
  const [newInitialData, setNewInitialData] = useState(initialData);

  const query = useQuery({
    queryKey: ["executions", workflowId, range.start, range.end],
    initialData: newInitialData,
    queryFn: () =>
      getAllWorkflowExecutionsClient(workflowId, range.start, range.end),
    refetchInterval: (query) => {
      return query.state.data?.workflowExecutions.some(
        (execution) =>
          execution.status === "PENDING" || execution.status === "EXECUTING",
      )
        ? 1000
        : false;
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
      <div className="max-w-[calc(100vw-(var(--spacing)*16))] overflow-hidden rounded-xl border md:max-w-[calc(100vw-255.2px-(var(--spacing)*16))]">
        {/* The inner <div>  manages the scrolling functionality. */}
        <div className="relative h-[calc(100vh-274.3px)] overflow-auto transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100vh-258.3px)]">
          <Table>
            <TableHeader className="dark:bg-sidebar bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="text-right">Started at</TableHead>
              </TableRow>
            </TableHeader>
            <ExecutionsTableBody
              workflowId={workflowId}
              queryData={query.data}
            />
          </Table>
        </div>
        <ExecutionsTableFooter
          queryData={query.data}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          rangeStart={range.start + 1}
          rangeEnd={range.end + 1}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );

  function calculateQueryRage() {
    const start = (page - 1) * rowsPerPage;
    const end = start + (rowsPerPage - 1);

    return { start, end };
  }
}
