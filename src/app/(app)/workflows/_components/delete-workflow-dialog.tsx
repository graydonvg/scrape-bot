import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import deleteWorkflowAction from "../_actions/delete-workflow-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userErrorMessages } from "@/lib/constants";
import CustomAlert from "@/components/custom-alert";
import { Trash2Icon } from "lucide-react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { ActionReturn } from "@/lib/types/action";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
};

export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Props) {
  const { existingWorkflowNames, setExistingWorkflowNames } =
    useWorkflowsStore();
  const [confirmText, setConfirmText] = useState("");
  const { execute, isPending } = useAction(deleteWorkflowAction, {
    onExecute: () => toast.loading("Deleting workflow...", { id: workflowId }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => {
      setConfirmText("");
      toast.error(userErrorMessages.Unexpected, { id: workflowId });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-0 p-0">
        <AlertDialogHeader className="grid gap-4 p-6">
          <AlertDialogTitle className="mb-0 text-2xl">
            Delete Workflow
          </AlertDialogTitle>
          <AlertDialogDescription className="text-card-foreground text-base">
            This will permanently delete your workflow and remove your data from
            our servers.
          </AlertDialogDescription>
          <CustomAlert
            variant="destructive"
            title="Warning!"
            description="This action is not reversible. Please be certain."
          />
        </AlertDialogHeader>
        <div className="bg-muted dark:bg-card grid gap-2 p-6">
          <Label className="text-muted-foreground font-normal select-text">
            Enter the workflow name{" "}
            <span className="text-card-foreground font-semibold">
              {workflowName}
            </span>{" "}
            to continue:
          </Label>
          <Input
            onChange={(e) => setConfirmText(e.target.value)}
            value={confirmText}
            className="bg-background"
          />
        </div>
        <AlertDialogFooter className="p-4">
          <AlertDialogCancel
            onClick={() => {
              setConfirmText("");
            }}
            className="m-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({
                variant: "destructive",
              }),
            )}
            disabled={confirmText !== workflowName || isPending}
            loading={isPending}
            startIcon={<Trash2Icon size={16} />}
            onClick={(e) => {
              e.preventDefault();
              execute({ workflowId });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  function handleSuccess(data?: ActionReturn) {
    setConfirmText("");

    if (data && !data.success) {
      return toast.error(data.message, { id: workflowId });
    }

    setOpen(false);
    setExistingWorkflowNames([
      ...existingWorkflowNames.filter(
        (existingWorkflowName) => existingWorkflowName !== workflowName,
      ),
    ]);

    toast.success("Workflow deleted", { id: workflowId });
  }
}
