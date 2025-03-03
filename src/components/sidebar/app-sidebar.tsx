"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppSidebar({
  children,
  ...props
}: ComponentProps<typeof Sidebar> & Props) {
  const pathname = usePathname();
  const isSidebarVariant = pathname.includes("/workflow/");

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant={isSidebarVariant ? "sidebar" : "inset"}
    >
      {children}
    </Sidebar>
  );
}
