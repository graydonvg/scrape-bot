import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import getAllWorkflowExecutionsServer from "../_data-access/get-all-workflow-executions-server";
import ExecutionsTableBody from "./executions-table-body";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionsTable({ workflowId, initialData }: Props) {
  return (
    <div className="container">
      {/* The outer <div>  applies the border radius and hides any overflow, ensuring that the scrollbar doesn't protrude beyond the rounded corners. */}
      <div className="overflow-hidden rounded-xl border">
        {/* The inner <div>  manages the scrolling functionality. */}
        <div className="relative h-[calc(100vh-194.3px)] overflow-y-auto transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100vh-114.3px)]">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="text-right">Started at</TableHead>
              </TableRow>
            </TableHeader>
            <ExecutionsTableBody
              workflowId={workflowId}
              initialData={initialData}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
