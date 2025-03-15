import { Metadata } from "next";
import { notFound } from "next/navigation";
import getAllWorkflowExecutionsServer from "./_data-access/get-all-workflow-executions-server";
import ExecutionHistory from "./_components/execution-history";

export const metadata: Metadata = {
  title: "Workflow executions",
};

type Params = {
  params: Promise<{ workflow_id: string }>;
};

export default async function ExecutionHistoryPage({ params }: Params) {
  const workflowId = (await params).workflow_id;

  const workflowExecutions = await getAllWorkflowExecutionsServer(workflowId);

  if (!workflowExecutions) notFound();

  return (
    <ExecutionHistory
      workflowId={workflowId}
      initialData={workflowExecutions}
    />
  );
}
