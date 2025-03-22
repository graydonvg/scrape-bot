"use client";

import {
  Sidebar as SidebarPrimitive,
  useSidebar,
} from "@/components/ui/sidebar";
import { ComponentProps, ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
} & ComponentProps<typeof SidebarPrimitive>;

export default function Sidebar({ children, ...props }: Props) {
  const { setOpen, sidebarBehaviour } = useSidebar();

  useEffect(() => {
    // logic to toggle sidebar open based on sidebarBehaviour state
    if (sidebarBehaviour === "open") setOpen(true);
    if (sidebarBehaviour === "closed") setOpen(false);
  }, [sidebarBehaviour, setOpen]);

  return (
    <SidebarPrimitive
      {...props}
      collapsible="icon"
      variant="sidebar"
      onMouseEnter={() => {
        if (sidebarBehaviour === "expandable") setOpen(true);
      }}
      onMouseLeave={() => {
        if (sidebarBehaviour === "expandable") setOpen(false);
      }}
    >
      {children}
    </SidebarPrimitive>
  );
}
