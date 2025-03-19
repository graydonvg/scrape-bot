import { notFound } from "next/navigation";
import getWorkflow from "./_data-access/get-workflow";
import Editor from "./_components/editor";

type Params = {
  params: Promise<{ workflow_id: string }>;
};

export async function generateMetadata({ params }: Params) {
  const workflowId = (await params).workflow_id;

  const workflow = await getWorkflow(workflowId);

  return {
    title: workflow ? workflow.name : "Not Found",
  };
}

export default async function WorkflowEditorPage({ params }: Params) {
  const workflowId = (await params).workflow_id;

  const workflow = await getWorkflow(workflowId);

  if (!workflow) notFound();

  return <Editor workflow={workflow} />;
}
