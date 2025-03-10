import getUserDataServer from "@/data-access/get-user-data-server";
import { NavUserClient } from "./nav-user-client";
import { redirect } from "next/navigation";

export default async function NavUserServer() {
  const userData = await getUserDataServer();

  if (!userData) return redirect("/signin");

  return <NavUserClient user={userData} />;
}
