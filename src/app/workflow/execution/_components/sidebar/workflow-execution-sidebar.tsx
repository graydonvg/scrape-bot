import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import AppSidebar from "@/components/sidebar/app-sidebar";
import SidebarLogo from "@/components/sidebar/sidebar-logo";
import { NavUserClient } from "@/components/sidebar/nav-user-client";
import ExecutionProgress from "./execution-progress";
import { Separator } from "@/components/ui/separator";

export default function WorkflowExecutionSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <ExecutionProgress />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUserClient />
      </SidebarFooter>
    </AppSidebar>
  );
}
