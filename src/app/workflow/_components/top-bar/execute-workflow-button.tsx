import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
import { PlayIcon } from "lucide-react";

type Props = {
  workflowId: number;
};

export default function ExecuteWorkflowButton({ workflowId }: Props) {
  const generateExecutionPlan = useWorkflowExecutionPlan();

  return (
    <ButtonWithSpinner
      className="h-9 w-[102px] gap-0 overflow-hidden transition-[width,height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:w-8 group-has-data-[collapsible=icon]/sidebar-wrapper:has-[>svg]:px-2"
      startIcon={<PlayIcon />}
      onClick={() => {
        const plan = generateExecutionPlan();
        console.log("--- plan ---");
        console.log(`workflowID: ${workflowId}`);
        console.table(plan);
      }}
    >
      <span className="ml-2 truncate transition-[margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0">
        Execute
      </span>
    </ButtonWithSpinner>
  );
}
