import geUserData from "@/app/(dashboard)/_services/get-user-data";
import { NavUserClient } from "./nav-user-client";

export default async function NavUserServer() {
  const userData = await geUserData();

  if (!userData) return null;

  return <NavUserClient user={{ avatar: "", ...userData }} />;
}
