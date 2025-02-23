import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import saveWorkflowAction from "../../_actions/save-workflow-action";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import ButtonWithSpinner from "@/components/button-with-spinner";

type Props = {
  workflowId: number;
};

export default function SaveWorkflowButton({ workflowId }: Props) {
  const toastId = "save-workflow";
  const { toObject } = useReactFlow();
  const { execute, isPending } = useAction(saveWorkflowAction, {
    onExecute: () => {
      toast.loading("Saving workflow...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        return toast.error(data.message, { id: toastId });
      }

      toast.success("Workflow saved", { id: toastId });
    },
    onError: () => {
      toast.error(USER_ERROR_MESSAGES.Unexpected, { id: toastId });
    },
  });

  return (
    <ButtonWithSpinner
      variant="outline"
      loading={isPending}
      startIcon={
        <CheckIcon
          size={16}
          className="stroke-green-700 dark:stroke-green-400"
        />
      }
      onClick={() =>
        execute({ workflowId, definition: JSON.stringify(toObject()) })
      }
    >
      {!isPending ? "Save" : "Saving..."}
    </ButtonWithSpinner>
  );
}
