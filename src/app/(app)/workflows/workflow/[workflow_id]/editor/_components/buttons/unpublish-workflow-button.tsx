import ButtonWithSpinner from "@/components/button-with-spinner";
import { DownloadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import { Dispatch, SetStateAction } from "react";
import { ActionReturn } from "@/lib/types/action";
import unpublishWorkflowAction from "../../_actions/unpublish-workflow-action";

type Props = {
  workflowId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function UnpublishWorkflowButton({
  workflowId,
  isLoading,
  setIsLoading,
}: Props) {
  const { execute, isPending } = useAction(unpublishWorkflowAction, {
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
      startIcon={<DownloadIcon />}
      onClick={() => execute({ workflowId })}
    >
      Unpublish
    </ButtonWithSpinner>
  );

  function handleExecute() {
    setIsLoading(true);
    toast.loading("Unpublishing workflow...", { id: workflowId });
  }

  function handleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: workflowId });
    }

    setIsLoading(false);
    toast.success("Workflow unpublished", { id: workflowId });
  }

  function handleError() {
    setIsLoading(false);
    toast.error(userErrorMessages.Unexpected, { id: workflowId });
  }
}
