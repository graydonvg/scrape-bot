import CustomAlert from "@/components/custom-alert";
import PageHeader from "@/components/page-header";
import UserCredentials from "./_components/credentials";
import { Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CredentialsSkeleton from "./_components/credentials-skeleton";
import AddCredentialDialog from "./_components/add-credential/add-credential-dialog";

export default function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div>
        <div>
          <PageHeader title="Credentials" subtitle="Manage your credentials">
            <AddCredentialDialog />
          </PageHeader>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8">
        <CustomAlert
          variant="success"
          title="Encryption"
          description="All information is securely encrypted, ensuring your data remains safe."
        />

        <ScrollArea className="max-h-[calc(100vh-303.6px)] min-h-[250px] flex-1 rounded-xl border">
          <Suspense fallback={<CredentialsSkeleton />}>
            <div className="p-4">
              <UserCredentials />
            </div>
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  );
}
