import { Sidebar } from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import TaskMenu from "./task-menu";
import AppSidebar from "@/components/sidebar/app-sidebar";

export default function WorkflowSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <TaskMenu />
    </AppSidebar>
  );
}
