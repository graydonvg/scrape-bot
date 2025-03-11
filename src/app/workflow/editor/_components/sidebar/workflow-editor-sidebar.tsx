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
import AvailableCredits from "@/components/sidebar/available-credits";

export default function WorkflowEditorSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="divide-y">
        <AvailableCredits containerClassName="p-4 transition-[padding] group-data-[collapsible=icon]:p-2!" />
        <TaskMenu />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUserClient />
      </SidebarFooter>
    </AppSidebar>
  );
}
