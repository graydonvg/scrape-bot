import { PlayIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import executeWorkflowAction from "../workflow/[workflow_id]/editor/_actions/execute-workflow-action";
import { ActionReturn } from "@/lib/types/action";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { Dispatch, SetStateAction } from "react";
import ButtonWithSpinner from "@/components/button-with-spinner";
import useUserStore from "@/lib/store/user-store";

type Props = {
  workflowId: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  creditCost: number;
};

export default function ExecuteWorkflowButton({
  workflowId,
  setIsLoading,
  creditCost,
}: Props) {
  const { userCreditBalance } = useUserStore();
  const { setSelectedTaskId } = useWorkflowsStore();
  const { execute, isPending } = useAction(executeWorkflowAction, {
    onExecute: () => handleExecute(),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => handleError(),
  });

  console.log(userCreditBalance !== null && userCreditBalance < creditCost);

  return (
    <ButtonWithSpinner
      variant="outline"
      size="sm"
      loading={isPending}
      className="ring-offset-card flex-1"
      startIcon={<PlayIcon />}
      onClick={handleClick}
    >
      Execute
    </ButtonWithSpinner>
  );

  function handleClick() {
    if (userCreditBalance !== null && userCreditBalance < creditCost)
      return toast.error(userErrorMessages.InsufficientCredits);

    execute({ workflowId });
  }

  function handleExecute() {
    setSelectedTaskId(null);
    setIsLoading(true);
    toast.loading("Processing workflow...", { id: workflowId });
  }

  function handleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      setIsLoading(false);
      return toast.error(data.message, { id: workflowId });
    }

    setIsLoading(false);
    toast.success("Execution started", { id: workflowId });
  }

  function handleError() {
    setIsLoading(false);
    toast.error(userErrorMessages.Unexpected, { id: workflowId });
  }
}
