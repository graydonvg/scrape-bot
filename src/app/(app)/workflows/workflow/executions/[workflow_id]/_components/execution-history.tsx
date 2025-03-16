import NoResultsFound from "@/components/no-results-found";
import getAllWorkflowExecutionsServer from "../_data-access/get-all-workflow-executions-server";
import ExecutionsTable from "./executions-table/executions-table";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionHistory({ workflowId, initialData }: Props) {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Worklfow Executions"
        subtitle="A list of all the workflow's executions"
      >
        <Link href={`/workflows/workflow/editor/${workflowId}`}>
          <Button>
            <PencilIcon />
            Edit Workflow
          </Button>
        </Link>
      </PageHeader>

      {initialData?.workflowExecutions.length === 0 ? (
        <NoResultsFound
          title="This worklfow has not been executed yet"
          description="Return to the editor to trigger an execution"
        />
      ) : (
        <ExecutionsTable workflowId={workflowId} initialData={initialData} />
      )}
    </div>
  );
}
