import { CSSProperties, ReactNode } from "react";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkflowSidebar from "./_components/sidebar/workflow-sidebar";

type Props = {
  children: ReactNode;
};

export default async function WorkflowLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "20rem",
        } as CSSProperties
      }
    >
      <WorkflowSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
