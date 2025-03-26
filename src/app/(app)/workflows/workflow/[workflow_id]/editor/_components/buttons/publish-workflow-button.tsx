import ButtonWithSpinner from "@/components/button-with-spinner";
import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import useUserStore from "@/lib/store/user-store";
import { calculateTotalCreditCostFromExecutionPlan } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { ActionReturn } from "@/lib/types/action";
import publishWorkflowAction from "../../_actions/publish-workflow-action";

type Props = {
  workflowId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function PublishWorkflowButton({
  workflowId,
  isLoading,
  setIsLoading,
}: Props) {
  const { userCreditBalance } = useUserStore();
  const generateExecutionPlan = useWorkflowExecutionPlan();
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(publishWorkflowAction, {
    onExecute: () => handleExecute(),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => handleError(),
  });

  return (
    <ButtonWithSpinner
      variant="outline"
      loading={isPending}
      disabled={isLoading}
      className="flex-1"
      startIcon={<UploadIcon />}
      onClick={handleClick}
    >
      Publish
    </ButtonWithSpinner>
  );

  function handleExecute() {
    setIsLoading(true);
    toast.loading("Publishing workflow...", { id: workflowId });
  }

  function handleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: workflowId });
    }

    setIsLoading(false);
    toast.success("Workflow published", { id: workflowId });
  }

  function handleError() {
    setIsLoading(false);
    toast.error(userErrorMessages.Unexpected, { id: workflowId });
  }

  function handleClick() {
    const executionPlan = generateExecutionPlan();

    if (executionPlan) {
      const totalCreditsRequired =
        calculateTotalCreditCostFromExecutionPlan(executionPlan);

      if (userCreditBalance && userCreditBalance < totalCreditsRequired)
        return toast.error(userErrorMessages.InsufficientCredits);

      execute({ workflowId, definition: JSON.stringify(toObject()) });
    }
  }
}
