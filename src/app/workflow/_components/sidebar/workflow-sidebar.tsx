import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NavUserServer from "@/components/sidebar/nav-user-server";
import SidebarLogo from "@/components/sidebar-logo";
import TaskMenu from "./task-menu";

export default function WorkflowSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <TaskMenu />
      </SidebarContent>
      <SidebarFooter>
        <Suspense
          fallback={
            <Skeleton className="bg-sidebar-accent h-12 w-full transition-[height] ease-linear group-data-[collapsible=icon]:size-8" />
          }
        >
          <NavUserServer />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
