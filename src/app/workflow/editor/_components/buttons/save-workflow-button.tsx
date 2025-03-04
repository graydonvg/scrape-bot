import { useReactFlow } from "@xyflow/react";
import { SaveIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import saveWorkflowAction from "../../_actions/save-workflow-action";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import ButtonWithSpinner from "@/components/button-with-spinner";

type Props = {
  workflowId: string;
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
      className="bg-success text-success-foreground hover:bg-success/90 h-9 w-[81px] gap-0 overflow-hidden transition-[width,height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:w-8 group-has-data-[collapsible=icon]/sidebar-wrapper:has-[>svg]:px-2"
      loading={isPending}
      startIcon={<SaveIcon />}
      onClick={() =>
        execute({ workflowId, definition: JSON.stringify(toObject()) })
      }
    >
      <span className="ml-2 truncate transition-[margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:ml-0">
        {!isPending ? "Save" : "Saving..."}
      </span>
    </ButtonWithSpinner>
  );
}
