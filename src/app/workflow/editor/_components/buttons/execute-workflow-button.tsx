import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import executeWorkflowAction from "../../_actions/execute-workflow-action";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  workflowId: string;
};

export default function ExecuteWorkflowButton({ workflowId }: Props) {
  const toastId = "execute-workflow";
  const { setWorkflowExecutionData } = useWorkflowsStore();
  const generateExecutionPlan = useWorkflowExecutionPlan();
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(executeWorkflowAction, {
    onExecute: () => {
      toast.loading("Executing workflow...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        return toast.error(data.message, { id: toastId });
      }

      setWorkflowExecutionData(null); // Clear any previous data to prevent flashing previous data before new data is fetched and added to store
      toast.success("Execution started", { id: toastId });
    },
    onError: () => {
      toast.error(USER_ERROR_MESSAGES.Unexpected, { id: toastId });
    },
  });

  return (
    <ButtonWithSpinner
      disabled={isPending}
      className="h-9 w-[102px] gap-0 overflow-hidden transition-[width,height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:w-8 group-has-data-[collapsible=icon]/sidebar-wrapper:has-[>svg]:px-2"
      startIcon={<PlayIcon />}
      onClick={() => {
        const plan = generateExecutionPlan();

        if (plan) {
          execute({ workflowId, definition: JSON.stringify(toObject()) });
        }
      }}
    >
      <span className="ml-2 truncate transition-[margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0">
        {!isPending ? "Execute" : "Executing..."}
      </span>
    </ButtonWithSpinner>
  );
}
