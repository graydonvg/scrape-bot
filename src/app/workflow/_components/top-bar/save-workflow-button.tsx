import { useReactFlow } from "@xyflow/react";
import { SaveIcon } from "lucide-react";
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
      className="bg-green-700 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 hover:bg-green-700/90"
      loading={isPending}
      startIcon={<SaveIcon size={16} />}
      onClick={() =>
        execute({ workflowId, definition: JSON.stringify(toObject()) })
      }
    >
      {!isPending ? "Save" : "Saving..."}
    </ButtonWithSpinner>
  );
}
