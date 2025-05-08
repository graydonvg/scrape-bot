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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userErrorMessages } from "@/lib/constants";
import CustomAlert from "@/components/custom-alert";
import { Trash2Icon } from "lucide-react";
import { ActionReturn } from "@/lib/types/action";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useAction } from "next-safe-action/hooks";
import deleteUserAccountAction from "../_actions/delete-user-account-action";

const TOAST_ID = "delete-user-account";
const CONFIRM_TEXT = "delete my account";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  customAvatarUrl: string | null;
};

export default function DeleteUserAccountDialog({
  open,
  setOpen,
  customAvatarUrl,
}: Props) {
  const [confirmText, setConfirmText] = useState("");
  const { execute, isPending } = useAction(deleteUserAccountAction, {
    onExecute: () => toast.loading("Deleting account...", { id: TOAST_ID }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: ({ error }) => handleError(error),
  });

  useEffect(() => {
    // Dismiss the toast if the component unmounts before the upload completes
    return () => {
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-0 p-0">
        <AlertDialogHeader className="grid gap-4 p-6">
          <AlertDialogTitle className="mb-0 text-2xl">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-card-foreground text-base">
            This will permanently delete your account and remove your data from
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
            To verify, type{" "}
            <span className="text-card-foreground font-semibold">
              {CONFIRM_TEXT}
            </span>{" "}
            below:
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
            disabled={confirmText !== CONFIRM_TEXT || isPending}
            loading={isPending}
            startIcon={<Trash2Icon size={16} />}
            onClick={(e) => {
              e.preventDefault();
              execute({ customAvatarUrl });
            }}
          >
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  function handleSuccess(data?: ActionReturn) {
    if (data && data.success === false) {
      toast.error(data.message, { id: TOAST_ID });
    }
  }

  function handleError(error: {
    serverError?: string | undefined;
    validationErrors?:
      | {
          formErrors: string[];
          fieldErrors: {
            customAvatarUrl?: string[] | undefined;
          };
        }
      | undefined;
    bindArgsValidationErrors?: readonly [] | undefined;
  }) {
    if (isRedirectError(error)) return toast.dismiss(TOAST_ID);

    toast.error(userErrorMessages.Unexpected, { id: TOAST_ID });
  }
}
