import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Layers2Icon } from "lucide-react";
import RenameWorkflowForm from "./rename-workflow-form";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowId: string;
  workflowName: string;
  workflowDescription: string | null;
};

export default function RenameWorkflowDialog({
  open,
  setOpen,
  workflowId,
  workflowName,
  workflowDescription,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <CustomDialogHeader title="Rename workflow" icon={Layers2Icon} />
        <RenameWorkflowForm
          setOpen={setOpen}
          workflowId={workflowId}
          workflowName={workflowName}
          workflowDescription={workflowDescription}
        />
      </DialogContent>
    </Dialog>
  );
}
