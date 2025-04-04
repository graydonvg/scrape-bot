"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { XIcon } from "lucide-react";

export default function SidebarLogo() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <SidebarMenuButton className="hover:bg-sidebar active:bg-sidebar p-0 group-data-[collapsible=icon]:p-0! md:shrink-0">
          <Logo />
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
