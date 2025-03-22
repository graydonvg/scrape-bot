"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { PanelLeftDashedIcon } from "lucide-react";
import { SidebarMenuItems } from "./sidebar-menu-items";

export default function SidebarControl() {
  const { isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          variant="outline"
          className="bg-sidebar ml-2 size-8 transition-[margin] group-data-[collapsible=icon]:ml-0"
        >
          <div className="flex-center size-4">
            <PanelLeftDashedIcon className="stroke-muted-foreground size-full" />
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        side="top"
        className="ml-2 min-w-[calc(16rem-(--spacing(4)))]"
      >
        <DropdownMenuLabel>Sidebar control</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SidebarMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
