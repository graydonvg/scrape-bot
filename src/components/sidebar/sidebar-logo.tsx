"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

export default function SidebarLogo() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <SidebarMenuButton size="lg" className="hover:bg-sidebar w-fit">
          <Logo isLink />
        </SidebarMenuButton>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <XIcon />
          </Button>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
