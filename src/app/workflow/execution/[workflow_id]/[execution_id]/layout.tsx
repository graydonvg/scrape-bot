import { CSSProperties, ReactNode } from "react";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkflowExecutionSidebar from "../../_components/sidebar/workflow-execution-sidebar";

type Props = {
  children: ReactNode;
};

export default async function WorkflowExecutionLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "25rem",
        } as CSSProperties
      }
    >
      <WorkflowExecutionSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
