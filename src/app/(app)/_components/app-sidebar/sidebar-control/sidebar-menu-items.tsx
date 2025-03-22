import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  SquareMousePointerIcon,
} from "lucide-react";
import SelectedMenuItemIndicator from "../selected-menu-item-indicator";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarMenuItems() {
  const { sidebarBehaviour, setSidebarBehaviour } = useSidebar();
  const menuItems = getMenuItems();

  return (
    <>
      {menuItems.map(({ label, icon, action, isSelected }) => (
        <DropdownMenuItem key={label} onClick={action}>
          {icon}
          {label}
          {isSelected && <SelectedMenuItemIndicator />}
        </DropdownMenuItem>
      ))}
    </>
  );

  function getMenuItems() {
    return [
      {
        label: "Expanded",
        icon: <PanelRightCloseIcon />,
        action: () => {
          setSidebarBehaviour("open");
        },
        isSelected: sidebarBehaviour === "open",
      },
      {
        label: "Collapsed",
        icon: <PanelRightOpenIcon />,
        action: () => {
          setSidebarBehaviour("closed");
        },
        isSelected: sidebarBehaviour === "closed",
      },
      {
        label: "Expand on hover",
        icon: <SquareMousePointerIcon />,
        action: () => {
          setSidebarBehaviour("expandable");
        },
        isSelected: sidebarBehaviour === "expandable",
      },
    ];
  }
}
