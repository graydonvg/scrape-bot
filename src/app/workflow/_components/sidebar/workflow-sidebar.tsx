import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import TaskMenu from "./task-menu";
import AppSidebar from "@/components/sidebar/app-sidebar";
import SidebarLogo from "@/components/sidebar-logo";
import { NavUserClient } from "@/components/sidebar/nav-user-client";

export default function WorkflowSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <TaskMenu />
      </SidebarContent>
      <SidebarFooter>
        <NavUserClient />
      </SidebarFooter>
    </AppSidebar>
  );
}
