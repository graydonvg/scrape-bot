import TopBar from "@/app/workflow/_components/top-bar/top-bar";
import NoResultsFound from "@/components/no-results-found";
import ExecutionsTable from "./executions-table";
import getAllWorkflowExecutionsServer from "../../_data-access/get-all-workflow-executions-server";

type Props = {
  workflowId: string;
  workflowExecutions: Awaited<
    ReturnType<typeof getAllWorkflowExecutionsServer>
  >;
};

export default function ExecutionHistory({
  workflowId,
  workflowExecutions,
}: Props) {
  return (
    <>
      <TopBar
        workflowId={workflowId}
        title="Workflow executions"
        subtitle="A list of all executions for this workflow"
        hideActionButtons
        hideSidebarTrigger
      />
      <main className="size-full">
        {workflowExecutions!.length === 0 ? (
          <NoResultsFound
            title="This worklfow has not been executed yet"
            description="Return to the editor to trigger an execution"
          />
        ) : (
          <ExecutionsTable
            workflowId={workflowId}
            initialData={workflowExecutions}
          />
        )}
      </main>
    </>
  );
}
