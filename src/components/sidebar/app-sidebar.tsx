import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { NavMain } from "./nav-main";
import SidebarLogo from "./sidebar-logo";
import { NavUser } from "./nav-user";
import SignOutButton from "../sign-out-button";

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
