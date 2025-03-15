import NoResultsFound from "@/components/no-results-found";
import getAllWorkflowExecutionsServer from "../_data-access/get-all-workflow-executions-server";
import ExecutionsTable from "./executions-table/executions-table";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getAllWorkflowExecutionsServer>>;
};

export default function ExecutionHistory({ workflowId, initialData }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="mr-6 flex shrink-0 flex-col">
          <h1 className="text-3xl font-bold">Executions</h1>
          <p className="text-muted-foreground">
            A list of all the workflow&apos;s executions
          </p>
        </div>
      </div>

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
