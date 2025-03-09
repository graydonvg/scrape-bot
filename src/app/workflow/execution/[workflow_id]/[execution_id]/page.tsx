import { Metadata } from "next";
import { notFound } from "next/navigation";
import getWorkflowExecutionWithTasksServer from "../../_data-access/get-execution-with-tasks-server";
import ExecutionDetails from "../../_components/execution-details";

export const metadata: Metadata = {
  title: "Workflow execution",
};

type Params = {
  params: Promise<{ workflow_id: string; execution_id: string }>;
};

export default async function WorkflowExecutionPage({ params }: Params) {
  const workflowId = (await params).workflow_id;
  const executionId = (await params).execution_id;

  const workflowExecution =
    await getWorkflowExecutionWithTasksServer(executionId);

  if (!workflowExecution) notFound();

  return (
    <ExecutionDetails workflowId={workflowId} initialData={workflowExecution} />
  );
}
