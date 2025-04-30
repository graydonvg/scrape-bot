import PageHeader from "@/components/page-header";
import AvatarCard from "./_components/avatar-card";
import PasswordCard from "./_components/password-card";
import UserNameCard from "./_components/user-name-card";
import getUserData from "@/data-access/get-user-data";
import { redirect } from "next/navigation";
import DeleteAccountCard from "./_components/delete-account-card";

export default async function AccountPage() {
  const userData = await getUserData();

  if (!userData) redirect("/signin");

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Account Settings" />
      <div className="space-y-8">
        <AvatarCard user={userData} />
        <UserNameCard user={userData} />
        {userData.provider === "email" && <PasswordCard />}
        <DeleteAccountCard />
      </div>
    </div>
  );
}
