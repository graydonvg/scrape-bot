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

const items = [
  {
    value: "open",
    label: "Expanded",
    icon: <PanelLeftOpenIcon />,
  },
  {
    value: "closed",
    label: "Collapsed",
    icon: <PanelLeftCloseIcon />,
  },
  {
    value: "expandable",
    label: "Expand on hover",
    icon: <SquareMousePointerIcon />,
  },
];

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
          {items.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              className="cursor-pointer capitalize"
            >
              {item.icon}
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
