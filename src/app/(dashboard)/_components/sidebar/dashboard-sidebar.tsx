import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps, Suspense } from "react";
import { NavMain } from "./nav-main";
import AppSidebar from "@/components/sidebar/app-sidebar";
import SidebarLogo from "@/components/sidebar/sidebar-logo";
import { Skeleton } from "@/components/ui/skeleton";
import NavUserServer from "@/components/sidebar/nav-user/nav-user-server";

export default function DashboardSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
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
    </AppSidebar>
  );
}
