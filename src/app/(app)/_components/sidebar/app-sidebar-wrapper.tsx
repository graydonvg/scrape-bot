"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import useSidebarOpensOnHover from "@/hooks/use-sidebar-opens-on-hover";
import useUserStore from "@/lib/store/user-store";
import { ComponentProps, ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
} & ComponentProps<typeof Sidebar>;

export default function AppSidebarWrapper({ children, ...props }: Props) {
  const sidebarOpensOnHover = useSidebarOpensOnHover();
  const { setOpen } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const { isUserMenuOpen } = useUserStore();

  function handleMouseEnter() {
    if (sidebarOpensOnHover) {
      setIsHovering(true);
      setOpen(true);
    }
  }

  function handleMouseLeave() {
    if (sidebarOpensOnHover && !isUserMenuOpen) {
      setIsHovering(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    if (isUserMenuOpen) return;

    if (sidebarOpensOnHover && !isHovering) setOpen(false);
    if (!sidebarOpensOnHover && isHovering) setIsHovering(false);
  }, [sidebarOpensOnHover, setOpen, isHovering, isUserMenuOpen]);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Sidebar>
  );
}
