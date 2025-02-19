import CustomAlert from "@/components/custom-alert";
import getWorkflow from "./_services/get-workflow";

type Params = {
  params: Promise<{ workflowId: string }>;
};

export default async function WorkflowPage({ params }: Params) {
  const workflowIdString = (await params).workflowId;
  const workflowIdNumber = parseInt(workflowIdString, 10);

  const workflow = await getWorkflow(workflowIdNumber);

  if (!workflow)
    return <CustomAlert title="Error" description="Workflow not found." />;

  return (
    <pre className="min-h-screen">{JSON.stringify(workflow, null, 2)}</pre>
  );
}
