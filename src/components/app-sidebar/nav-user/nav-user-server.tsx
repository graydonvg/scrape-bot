import getUserData from "@/data-access/get-user-data";
import { redirect } from "next/navigation";
import { NavUserClient } from "./nav-user-client";

export default async function NavUserServer() {
  const userData = await getUserData();

  if (!userData) return redirect("/signin");

  return <NavUserClient user={userData} />;
}
