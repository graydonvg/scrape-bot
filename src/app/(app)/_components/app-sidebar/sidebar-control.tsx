"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarBehaviour,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  PanelLeftCloseIcon,
  PanelLeftDashedIcon,
  PanelLeftOpenIcon,
  SquareMousePointerIcon,
} from "lucide-react";

export default function SidebarControl() {
  const { isMobile, sidebarBehaviour, setSidebarBehaviour } = useSidebar();

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
        <DropdownMenuRadioGroup
          value={sidebarBehaviour}
          onValueChange={(value) =>
            setSidebarBehaviour(value as SidebarBehaviour)
          }
        >
          <DropdownMenuLabel>Sidebar control</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="open">
            <PanelLeftOpenIcon />
            Expanded
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="closed">
            <PanelLeftCloseIcon />
            Collapsed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="expandable">
            <SquareMousePointerIcon />
            Expand on hover
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
