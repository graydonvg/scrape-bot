import CustomAlert from "@/components/custom-alert";
import getUserCredentials from "../_data-access/get-user-credentials";
import NoResultsFound from "@/components/no-results-found";
import { ShieldOffIcon } from "lucide-react";
import AddCredentialDialog from "./add-credential/add-credential-dialog";
import CredentialCards from "./credential-cards";

export default async function UserCredentials() {
  const credentials = await getUserCredentials();

  if (!credentials) {
    return (
      <CustomAlert
        variant="destructive"
        title="Error"
        description="Something went wrong. Please try again later."
      />
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="absolute-center">
        <NoResultsFound
          title="No credentials added yet"
          description="Click the button below to add your first credential"
          icon={
            <ShieldOffIcon className="stroke-primary size-10 dark:stroke-blue-500" />
          }
        >
          <AddCredentialDialog triggerLabel="Add your first credential" />
        </NoResultsFound>
      </div>
    );
  }

  return <CredentialCards credentials={credentials} />;
}
