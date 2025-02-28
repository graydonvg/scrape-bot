import { Sidebar } from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { NavMain } from "./nav-main";
import AppSidebar from "@/components/sidebar/app-sidebar";

export default function DashboardSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar {...props}>
      <NavMain />
    </AppSidebar>
  );
}
