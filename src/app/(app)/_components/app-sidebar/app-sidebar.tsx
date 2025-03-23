import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { ComponentProps, Suspense } from "react";
import { NavMain } from "./nav-main";
import { Skeleton } from "@/components/ui/skeleton";
import NavUserServer from "@/app/(app)/_components/app-sidebar/nav-user/nav-user-server";
import SidebarLogo from "./sidebar-logo";
import Sidebar from "./sidebar";
import SidebarControl from "./sidebar-control";

export default function AppSidebar({
  ...props
}: ComponentProps<typeof SidebarPrimitive>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-12">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <Suspense
          fallback={
            <Skeleton className="bg-sidebar-accent h-12 w-full transition-[height] ease-linear group-data-[collapsible=icon]:h-8" />
          }
        >
          <NavUserServer />
        </Suspense>
        <SidebarControl />
      </SidebarFooter>
    </Sidebar>
  );
}
