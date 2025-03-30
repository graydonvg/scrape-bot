"use client";

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
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userErrorMessages } from "@/lib/constants";
import CustomAlert from "@/components/custom-alert";
import { Trash2Icon, XIcon } from "lucide-react";
import { ActionReturn } from "@/lib/types/action";
import deleteCredentialAction from "../_actions/delete-credential-action";
import { DeleteCredentialSchemaType } from "@/lib/schemas/credential";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import useCredentialsStore from "@/lib/store/credentials-store";

type Props = {
  credentialId: string;
  credentialName: string;
};

export default function DeleteCredentialDialog({
  credentialId,
  credentialName,
}: Props) {
  const { existingCredentialNames, setExistingCredentialNames } =
    useCredentialsStore();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { execute, isPending } = useAction(deleteCredentialAction, {
    onExecute: () =>
      toast.loading("Deleting credential...", { id: credentialId }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => {
      setConfirmText("");
      toast.error(userErrorMessages.Unexpected, { id: credentialId });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon className="size-4.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0">
        <AlertDialogHeader className="grid gap-4 p-6">
          <AlertDialogTitle className="mb-0 text-2xl">
            Delete Credential
          </AlertDialogTitle>
          <AlertDialogDescription className="text-card-foreground text-base">
            This will permanently delete your credential and remove your data
            from our servers.
          </AlertDialogDescription>
          <CustomAlert
            variant="destructive"
            title="Warning!"
            description="This action is not reversible. Please be certain."
          />
        </AlertDialogHeader>
        <div className="bg-muted dark:bg-card grid gap-2 p-6">
          <Label className="text-muted-foreground font-normal select-text">
            Enter the credential name{" "}
            <span className="text-card-foreground font-semibold">
              {credentialName}
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
            disabled={confirmText !== credentialName || isPending}
            loading={isPending}
            startIcon={<Trash2Icon size={16} />}
            onClick={(e) => {
              e.preventDefault();
              execute({ credentialId });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  function handleSuccess(
    data?: ActionReturn<keyof DeleteCredentialSchemaType>,
  ) {
    setConfirmText("");

    if (data && !data.success) {
      return toast.error(data.message, { id: credentialId });
    }

    setOpen(false);
    setExistingCredentialNames([
      ...existingCredentialNames.filter(
        (existingWorkflowName) => existingWorkflowName !== credentialName,
      ),
    ]);

    toast.success("Credential deleted", { id: credentialId });
  }
}
