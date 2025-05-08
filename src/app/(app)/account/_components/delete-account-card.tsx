"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import DeleteUserAccountDialog from "./delete-user-account-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  customAvatarUrl: string | null;
};

export default function DeleteAccountCard({ customAvatarUrl }: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Card className="border-destructive/50 overflow-hidden">
        <CardHeader>
          <CardTitle>
            <h2 className="text-lg font-semibold">Delete Account</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Permanently remove your account and all of its contents. This action
            is not reversible, so please continue with caution.
          </p>
        </CardContent>
        <CardFooter className="bg-background p-0">
          <div className="border-destructive/50 bg-destructive/10 flex size-full items-center justify-end border-t px-6 py-3">
            <Button
              onClick={() => {
                setOpenDeleteDialog(true);
              }}
              type="button"
              variant="destructive"
            >
              <Trash2Icon size={16} />
              Delete account
            </Button>
          </div>
        </CardFooter>
      </Card>
      <DeleteUserAccountDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        customAvatarUrl={customAvatarUrl}
      />
    </>
  );
}
