import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionQueue from "@/hooks/use-workflow-execution-queue";
import { PlayIcon } from "lucide-react";

type Props = {
  workflowId: number;
};

export default function ExecuteWorkflowButton({ workflowId }: Props) {
  const generateExecutionQueue = useWorkflowExecutionQueue();

  return (
    <ButtonWithSpinner
      className="h-9 w-[102px] gap-0 overflow-hidden transition-[width,height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:w-8 group-has-data-[collapsible=icon]/sidebar-wrapper:has-[>svg]:px-2"
      startIcon={<PlayIcon />}
      onClick={() => {
        const queue = generateExecutionQueue();
        console.log("--- queue ---");
        console.log(`workflowID: ${workflowId}`);
        console.table(queue);
      }}
    >
      <span className="ml-2 truncate transition-[margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0">
        Execute
      </span>
    </ButtonWithSpinner>
  );
}
