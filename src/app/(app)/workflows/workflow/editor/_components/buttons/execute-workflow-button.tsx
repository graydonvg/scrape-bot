import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import executeWorkflowAction from "../../_actions/execute-workflow-action";
import { useSidebar } from "@/components/ui/sidebar";
import TooltipWrapper from "@/components/tooltip-wrapper";
import useUserStore from "@/lib/store/user-store";
import { calculateTotalCreditsRequired } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  workflowId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function ExecuteWorkflowButton({
  workflowId,
  isLoading,
  setIsLoading,
}: Props) {
  const toastId = "execute-workflow";
  const { isMobile, state } = useSidebar();
  const { userCreditBalance } = useUserStore();
  const generateExecutionPlan = useWorkflowExecutionPlan();
  const { setSelectedTaskId } = useWorkflowsStore();
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(executeWorkflowAction, {
    onExecute: () => {
      setSelectedTaskId(null);
      setIsLoading(true);
      toast.loading("Processing workflow...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        return toast.error(data.message, { id: toastId });
      }

      setIsLoading(false);
      toast.success("Execution started", { id: toastId });
    },
    onError: () => {
      setIsLoading(false);
      toast.error(USER_ERROR_MESSAGES.Unexpected, { id: toastId });
    },
  });

  return (
    <TooltipWrapper
      hidden={state !== "collapsed" || isMobile}
      tooltipContent="Execute workflow"
    >
      <ButtonWithSpinner
        loading={isPending}
        disabled={isLoading}
        className="flex-1"
        startIcon={<PlayIcon />}
        onClick={() => {
          const executionPlan = generateExecutionPlan();

          if (executionPlan) {
            const totalCreditsRequired =
              calculateTotalCreditsRequired(executionPlan);

            if (userCreditBalance < totalCreditsRequired)
              return toast.error(USER_ERROR_MESSAGES.InsufficientCredits);

            execute({ workflowId, definition: JSON.stringify(toObject()) });
          }
        }}
      >
        Execute
      </ButtonWithSpinner>
    </TooltipWrapper>
  );
}
