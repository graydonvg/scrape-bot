import { useReactFlow } from "@xyflow/react";
import { SaveIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import saveWorkflowAction from "../../_actions/save-workflow-action";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { Dispatch, SetStateAction } from "react";
import { ActionReturn } from "@/lib/types/action";

type Props = {
  workflowId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function SaveWorkflowButton({
  workflowId,
  isLoading,
  setIsLoading,
}: Props) {
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(saveWorkflowAction, {
    onExecute: () => handleExecute(),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => handleError(),
  });

  return (
    <ButtonWithSpinner
      loading={isPending}
      disabled={isLoading}
      className="bg-success text-success-foreground hover:bg-success/90 flex-1"
      startIcon={<SaveIcon />}
      onClick={() =>
        execute({ workflowId, definition: JSON.stringify(toObject()) })
      }
    >
      Save
    </ButtonWithSpinner>
  );

  function handleExecute() {
    setIsLoading(true);
    toast.loading("Saving workflow...", { id: workflowId });
  }

  function handleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: workflowId });
    }

    setIsLoading(false);
    toast.success("Workflow saved", { id: workflowId });
  }

  function handleError() {
    setIsLoading(false);
    toast.error(userErrorMessages.Unexpected, { id: workflowId });
  }
}
