import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps, ReactNode, Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import SidebarLogo from "@/components/sidebar-logo";
import NavUserServer from "@/components/sidebar/nav-user-server";
import AppSidebarWrapper from "./app-sidebar-wrapper";

type Props = {
  children: ReactNode;
};

export default function AppSidebar({
  children,
  ...props
}: ComponentProps<typeof Sidebar> & Props) {
  return (
    <AppSidebarWrapper {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter>
        <Suspense
          fallback={
            <Skeleton className="bg-sidebar-accent h-12 w-full transition-[height] ease-linear group-data-[collapsible=icon]:size-8" />
          }
        >
          <NavUserServer />
        </Suspense>
      </SidebarFooter>
    </AppSidebarWrapper>
  );
}
