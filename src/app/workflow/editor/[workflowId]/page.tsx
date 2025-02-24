import { notFound } from "next/navigation";
import getWorkflow from "../../_data-access/get-workflow";
import Editor from "../../_components/editor";

type Params = {
  params: Promise<{ workflowId: string }>;
};

export async function generateMetadata({ params }: Params) {
  const workflowIdString = (await params).workflowId;
  const workflowIdNumber = parseInt(workflowIdString, 10);

  const workflow = await getWorkflow(workflowIdNumber);

  return {
    title: workflow ? workflow.name : "Not Found",
  };
}

export default async function WorkflowPage({ params }: Params) {
  const workflowIdString = (await params).workflowId;
  const workflowIdNumber = parseInt(workflowIdString, 10);

  const workflow = await getWorkflow(workflowIdNumber);

  if (!workflow) notFound();

  return <Editor workflow={workflow} />;
}
