"use client";

import CustomDialogHeader from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon, ShieldEllipsisIcon } from "lucide-react";
import { useState } from "react";
import AddCredentialForm from "./add-credential-form";

type Props = {
  triggerLabel?: string;
};

export default function AddCredentialDialog({ triggerLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          {triggerLabel ?? "Add credential"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Add credential"
          // subtitle="Start building your workflow"
          icon={ShieldEllipsisIcon}
        />
        <AddCredentialForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
