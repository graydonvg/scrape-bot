import ButtonWithSpinner from "@/components/button-with-spinner";
// import useWorkflowExecutionPlan from "@/hooks/use-workflow-execution-plan";
// import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
// import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
// import { userErrorMessages } from "@/lib/constants";
// import executeWorkflowAction from "../../_actions/execute-workflow-action";
// import useUserStore from "@/lib/store/user-store";
// import { calculateTotalCreditCostFromExecutionPlan } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
// import useWorkflowsStore from "@/lib/store/workflows-store";
// import { ActionReturn } from "@/lib/types/action";
// import { useRouter } from "next/navigation";

type Props = {
  workflowId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function ExecuteWorkflowButton({
  // workflowId,
  isLoading,
  // setIsLoading,
}: Props) {
  // const router = useRouter();
  // const { userCreditBalance } = useUserStore();
  // const generateExecutionPlan = useWorkflowExecutionPlan();
  // const { setSelectedTaskId } = useWorkflowsStore();
  // const { toObject } = useReactFlow();
  // const { execute, isPending } = useAction(executeWorkflowAction, {
  //   onExecute: () => handleExecute(),
  //   onSuccess: ({ data }) => handleSuccess(data),
  //   onError: () => handleError(),
  // });

  return (
    <ButtonWithSpinner
      // loading={isPending}
      disabled={isLoading}
      className="flex-1"
      startIcon={<PlayIcon />}
      onClick={handleClick}
    >
      Execute
    </ButtonWithSpinner>
  );

  function handleClick() {
    return toast.info("This feature is still under construction");

    // const executionPlan = generateExecutionPlan();

    // if (executionPlan) {
    //   const totalCreditsRequired =
    //     calculateTotalCreditCostFromExecutionPlan(executionPlan);

    //   if (
    //     userCreditBalance !== null &&
    //     userCreditBalance < totalCreditsRequired
    //   )
    //     return toast.error(userErrorMessages.InsufficientCredits);

    //   execute({ workflowId, definition: JSON.stringify(toObject()) });
    // }
  }

  // function handleExecute() {
  //   setSelectedTaskId(null);
  //   setIsLoading(true);
  //   toast.loading("Processing workflow...", { id: workflowId });
  // }

  // function handleSuccess(data?: ActionReturn) {
  //   if (data && !data.success) {
  //     setIsLoading(false);
  //     return toast.error(data.message, { id: workflowId });
  //   }

  //   setIsLoading(false);
  //   router.refresh();
  //   toast.success("Execution started", { id: workflowId });
  // }

  // function handleError() {
  //   setIsLoading(false);
  //   router.refresh();
  //   toast.error(userErrorMessages.Unexpected, { id: workflowId });
  // }
}
