import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarBehaviour,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AppHeader from "./_components/app-header/app-header";
import AppContainer from "./_components/app-container";
import AppSidebar from "./_components/app-sidebar/app-sidebar";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const defaultSidebarBehaviour = cookieStore.get("sidebar_behaviour")
    ?.value as SidebarBehaviour | undefined;

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      defaultBehaviour={defaultSidebarBehaviour}
    >
      <AppSidebar />
      <SidebarInset className="max-h-screen overflow-hidden">
        <AppHeader />
        <Separator orientation="horizontal" className="z-50" />
        <AppContainer>{children}</AppContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
