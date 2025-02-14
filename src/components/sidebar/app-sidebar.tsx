import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { NavMain } from "./nav-main";
import SidebarLogo from "./sidebar-logo";
import SignOutButton from "../auth/sign-out-button";
import { NavUser } from "./nav-user";

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{ avatar: "", email: "john@doe.com", name: "John Doe" }}
        />
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
