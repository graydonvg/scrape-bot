import getUserDataServer from "@/app/(app)/_data-access/get-user-data-server";
import { redirect } from "next/navigation";
import { NavUserClient } from "./nav-user-client";

export default async function NavUserServer() {
  const userData = await getUserDataServer();

  if (!userData) return redirect("/signin");

  return <NavUserClient user={userData} />;
}
