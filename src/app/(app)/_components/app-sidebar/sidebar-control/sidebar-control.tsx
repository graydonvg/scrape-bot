"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { SidebarMenuItems } from "./sidebar-menu-items";

export default function SidebarControl() {
  const { isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="sm"
          variant="outline"
          className="bg-sidebar ml-2 h-full w-fit transition-[margin] group-data-[collapsible=icon]:ml-0"
        >
          <div className="flex-center size-4">
            <PanelLeftIcon className="size-full" />
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        side="bottom"
        className="ml-2 min-w-[calc(16rem-(--spacing(4)))] rounded-lg"
      >
        <DropdownMenuLabel>Sidebar control</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SidebarMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
