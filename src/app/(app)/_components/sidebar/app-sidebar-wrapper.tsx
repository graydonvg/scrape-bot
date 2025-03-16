"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { ComponentProps, ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
} & ComponentProps<typeof Sidebar>;

export default function AppSidebarWrapper({ children, ...props }: Props) {
  const {
    setOpen,
    isMenuOpen,
    isMouseOverSidebar,
    setIsMouseOverSidebar,
    opensOnHover,
  } = useSidebar();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (opensOnHover) {
      setIsMouseOverSidebar(true);
      setOpen(true);
    }
  }

  function handleMouseLeave() {
    if (opensOnHover && !isMenuOpen) {
      setIsMouseOverSidebar(false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 0);
    }
  }

  useEffect(() => {
    if (isMenuOpen) return;

    if (opensOnHover && !isMouseOverSidebar) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 0);
    }

    if (!opensOnHover && isMouseOverSidebar) setIsMouseOverSidebar(false);

    if (!opensOnHover) setOpen(true);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    opensOnHover,
    setOpen,
    isMouseOverSidebar,
    isMenuOpen,
    setIsMouseOverSidebar,
  ]);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Sidebar>
  );
}
