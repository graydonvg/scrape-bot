import { Metadata } from "next";
import { notFound } from "next/navigation";
import ExecutionViewer from "../../_components/execution-viewer";
import getWorkflowExecutionWithPhasesServer from "../../_data-access/get-execution-with-phases-server";

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
    await getWorkflowExecutionWithPhasesServer(executionId);

  if (!workflowExecution) notFound();

  console.log(workflowExecution.executionPhases);

  return (
    <ExecutionViewer workflowId={workflowId} initialData={workflowExecution} />
  );
}
