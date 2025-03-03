import { CSSProperties, ReactNode } from "react";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkflowEditorSidebar from "../_components/sidebar/workflow-editor-sidebar";

type Props = {
  children: ReactNode;
};

export default async function WorkflowEditorLayout({ children }: Props) {
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
      <WorkflowEditorSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
