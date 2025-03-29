"use client";

import CustomDialogHeader from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Layers2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import CreateWorkflowForm from "./create-workflow-form";

type Props = {
  triggerLabel?: string;
};

export default function CreateWorkflowDialog({ triggerLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          {triggerLabel ?? "Create workflow"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Create workflow"
          subtitle="Start building your workflow"
          icon={Layers2Icon}
        />
        <CreateWorkflowForm />
      </DialogContent>
    </Dialog>
  );
}
