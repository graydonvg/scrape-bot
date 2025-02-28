import geUserData from "@/data-access/get-user-data";
import { NavUserClient } from "./nav-user-client";
import { redirect } from "next/navigation";

export default async function NavUserServer() {
  const userData = await geUserData();

  if (!userData) return redirect("/signin");

  return <NavUserClient user={{ avatar: "", ...userData }} />;
}
