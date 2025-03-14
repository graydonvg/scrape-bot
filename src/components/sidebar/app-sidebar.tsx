import { Sidebar } from "@/components/ui/sidebar";
import { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppSidebar({
  children,
  ...props
}: ComponentProps<typeof Sidebar> & Props) {
  return (
    <Sidebar collapsible="icon" {...props} variant="sidebar">
      {children}
    </Sidebar>
  );
}
