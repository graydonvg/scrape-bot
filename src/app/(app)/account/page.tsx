import PageHeader from "@/components/page-header";
import AvatarCard from "./_components/avatar-card";
import PasswordCard from "./_components/password-card";
import UserNameCard from "./_components/user-name-card";
import getUserData from "@/data-access/get-user-data";
import DeleteAccountCard from "./_components/delete-account-card";
import CustomAlert from "@/components/custom-alert";

export default async function AccountPage() {
  const userData = await getUserData();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Account Settings" />
      {userData ? (
        <div className="space-y-8">
          <AvatarCard user={userData} />
          <UserNameCard user={userData} />
          {userData.provider === "email" && <PasswordCard />}
          <DeleteAccountCard />
        </div>
      ) : (
        <CustomAlert
          variant="destructive"
          title="Error"
          description="Something went wrong. Please try again later."
        />
      )}
    </div>
  );
}
