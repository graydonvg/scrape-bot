import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar/app-sidebar";
import { cookies } from "next/headers";
import AppHeader from "./_components/app-header/app-header";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Separator orientation="horizontal" className="z-50" />
        <div className="container flex grow flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
