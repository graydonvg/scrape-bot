import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import executeWorkflowAction from "../../_actions/execute-workflow-action";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { useSidebar } from "@/components/ui/sidebar";
import TooltipWrapper from "@/components/tooltip-wrapper";
import useUserStore from "@/lib/store/user-store";
import { calculateTotalCreditsRequired } from "@/lib/utils";

type Props = {
  workflowId: string;
};

export default function ExecuteWorkflowButton({ workflowId }: Props) {
  const toastId = "execute-workflow";
  const { isMobile, state } = useSidebar();
  const { user } = useUserStore();
  const { setWorkflowExecutionData } = useWorkflowsStore();
  const generateExecutionPlan = useWorkflowExecutionPlan();
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(executeWorkflowAction, {
    onExecute: () => {
      toast.loading("Processing workflow...", { id: toastId });
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
    <TooltipWrapper
      hidden={state !== "collapsed" || isMobile}
      tooltipContent="Execute workflow"
    >
      <ButtonWithSpinner
        disabled={isPending}
        className="h-9 w-[102px] gap-0 overflow-hidden transition-[width,height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:w-8 group-has-data-[collapsible=icon]/sidebar-wrapper:has-[>svg]:px-2"
        startIcon={<PlayIcon />}
        onClick={() => {
          const executionPlan = generateExecutionPlan();

          if (executionPlan) {
            const totalCreditsRequired =
              calculateTotalCreditsRequired(executionPlan);

            if (user.credits < totalCreditsRequired)
              return toast.error(USER_ERROR_MESSAGES.InsufficientCredits);

            execute({ workflowId, definition: JSON.stringify(toObject()) });
          }
        }}
      >
        <span className="ml-2 truncate transition-[margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0">
          {!isPending ? "Execute" : "Processing..."}
        </span>
      </ButtonWithSpinner>
    </TooltipWrapper>
  );
}
