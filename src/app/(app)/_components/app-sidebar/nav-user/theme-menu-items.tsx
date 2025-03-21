"use client";

import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react";
import SelectedMenuItemIndicator from "../selected-menu-item-indicator";

const modes = [
  {
    name: "light",
    icon: <SunIcon />,
  },
  {
    name: "dark",
    icon: <MoonIcon />,
  },
  {
    name: "system",
    icon: <LaptopMinimalIcon />,
  },
];

export function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {modes.map((mode) => (
        <DropdownMenuItem
          key={mode.name}
          onClick={() => setTheme(mode.name)}
          className="capitalize"
        >
          {mode.icon}
          {mode.name}
          {mode.name === theme && <SelectedMenuItemIndicator />}
        </DropdownMenuItem>
      ))}
    </>
  );
}
