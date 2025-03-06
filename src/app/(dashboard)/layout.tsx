import BreadcrumbHeader from "@/components/breadcrumb-header";
import { ThemeMenu } from "@/components/theme/theme-menu";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSidebar from "./_components/sidebar/dashboard-sidebar";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <SidebarInset className="border">
        <header className="flex h-16 shrink-0 items-center rounded-t-xl px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex size-full items-center justify-between">
            <div className="flex size-full items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 !h-[25%]" />
              <BreadcrumbHeader />
            </div>
            <ThemeMenu />
          </div>
        </header>
        <Separator orientation="horizontal" />
        <div className="container size-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
