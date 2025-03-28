import { PlayIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import executeWorkflowAction from "../workflow/[workflow_id]/editor/_actions/execute-workflow-action";
import { ActionReturn } from "@/lib/types/action";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { Dispatch, SetStateAction } from "react";
import ButtonWithSpinner from "@/components/button-with-spinner";

type Props = {
  workflowId: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function ExecuteWorkflowButton({
  workflowId,
  setIsLoading,
}: Props) {
  const { setSelectedTaskId } = useWorkflowsStore();
  const { execute, isPending } = useAction(executeWorkflowAction, {
    onExecute: () => handleExecute(),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => handleError(),
  });

  return (
    <ButtonWithSpinner
      variant="outline"
      size="sm"
      loading={isPending}
      className="ring-offset-card flex-1"
      startIcon={<PlayIcon />}
      onClick={() => execute({ workflowId })}
    >
      Execute
    </ButtonWithSpinner>
  );

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
