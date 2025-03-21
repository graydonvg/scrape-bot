import { useReactFlow } from "@xyflow/react";
import { SaveIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import saveWorkflowAction from "../../_actions/save-workflow-action";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { Dispatch, SetStateAction } from "react";

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
  const toastId = "save-workflow";
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(saveWorkflowAction, {
    onExecute: () => {
      setIsLoading(true);
      toast.loading("Saving workflow...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        return toast.error(data.message, { id: toastId });
      }

      setIsLoading(false);
      toast.success("Workflow saved", { id: toastId });
    },
    onError: () => {
      setIsLoading(false);
      toast.error(USER_ERROR_MESSAGES.Unexpected, { id: toastId });
    },
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
}
