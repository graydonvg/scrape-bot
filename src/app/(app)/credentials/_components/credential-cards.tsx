"use client";

import { Card } from "@/components/ui/card";
import { CredentialDb } from "@/lib/types/credential";
import { formatDistanceToNow } from "date-fns";
import { LockKeyholeIcon } from "lucide-react";
import DeleteCredentialDialog from "./delete-credential-dialog";
import useCredentialsStore from "@/lib/store/credentials-store";
import { useEffect } from "react";

type Props = {
  credentials: CredentialDb[];
};

export default function CredentialCards({ credentials }: Props) {
  const { setExistingCredentialNames } = useCredentialsStore();

  useEffect(() => {
    setExistingCredentialNames(
      credentials.map((credential) => credential.name),
    );
  }, [credentials, setExistingCredentialNames]);

  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card
            key={credential.credentialId}
            className="flex w-full items-center justify-between rounded-md p-4"
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex-center size-8 rounded-full">
                <LockKeyholeIcon className="stroke-primary size-4.5 dark:stroke-blue-500" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <span className="text-muted-foreground text-xs">
                  {createdAt}
                </span>
              </div>
            </div>
            <DeleteCredentialDialog
              credentialId={credential.credentialId}
              credentialName={credential.name}
            />
          </Card>
        );
      })}
    </div>
  );
}
