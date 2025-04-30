import { ReactNode } from "react";
import {
  SidebarBehaviour,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AppHeader from "@/app/(app)/_components/app-header/app-header";
import AppSidebar from "@/app/(app)/_components/app-sidebar/app-sidebar";
import AppContainer from "@/components/app-container";

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
        <AppContainer>{children}</AppContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
