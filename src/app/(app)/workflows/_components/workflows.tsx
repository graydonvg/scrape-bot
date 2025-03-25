import CreateWorkflowDialog from "./create-workflow-dialog";
import CustomAlert from "@/components/custom-alert";
import getWorkflows from "../_data-access/get-workkflows";
import WorkflowCards from "./workflow-cards";
import NoResultsFound from "@/components/no-results-found";

export default async function Workflows() {
  const workflows = await getWorkflows();

  if (!workflows) {
    return (
      <CustomAlert
        title="Error"
        description="Something went wrong. Please try again later."
      />
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="absolute-center">
        <NoResultsFound
          title="No workflow created yet"
          description="Click the button below to create your first workflow"
        >
          <CreateWorkflowDialog triggerLabel="Create your first workflow" />
        </NoResultsFound>
      </div>
    );
  }

  return <WorkflowCards workflows={workflows} />;
}
