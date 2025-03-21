import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  SquareMousePointerIcon,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import SelectedMenuItemIndicator from "../selected-menu-item-indicator";

export function SidebarMenuItems() {
  const { setOpen, sidebarBehaviour, setSidebarBehaviour, state } =
    useSidebar();
  const isExpandable = sidebarBehaviour === "expandable";
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
          setOpen(true);
          setSidebarBehaviour("open");
        },
        isSelected: state === "expanded" && !isExpandable,
      },
      {
        label: "Collapsed",
        icon: <PanelRightOpenIcon />,
        action: () => {
          setOpen(false);
          setSidebarBehaviour("closed");
        },
        isSelected: state === "collapsed" && !isExpandable,
      },
      {
        label: "Expand on hover",
        icon: <SquareMousePointerIcon />,
        action: () => {
          setSidebarBehaviour("expandable");
        },
        isSelected: isExpandable,
      },
    ];
  }
}
