import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import TaskMenu from "./task-menu";
import AppSidebar from "@/components/sidebar/app-sidebar";
import SidebarLogo from "@/components/sidebar/sidebar-logo";
import { NavUserClient } from "@/components/sidebar/nav-user/nav-user-client";
import { Separator } from "@/components/ui/separator";

export default function WorkflowEditorSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <TaskMenu />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUserClient />
      </SidebarFooter>
    </AppSidebar>
  );
}
