"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppSidebarWrapper({
  children,
  ...props
}: ComponentProps<typeof Sidebar> & Props) {
  const pathname = usePathname();
  const isEditor = pathname.includes("/editor");

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant={isEditor ? "sidebar" : "inset"}
    >
      {children}
    </Sidebar>
  );
}
