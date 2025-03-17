"use client";

import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CircleIcon, LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react";

const modes = [
  {
    name: "light",
    icon: SunIcon,
  },
  {
    name: "dark",
    icon: MoonIcon,
  },
  {
    name: "system",
    icon: LaptopMinimalIcon,
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
          <mode.icon />
          {mode.name}
          {mode.name === theme && (
            <CircleIcon className="fill-popover-foreground stroke-popover-foreground ml-auto size-2" />
          )}
        </DropdownMenuItem>
      ))}
    </>
  );
}
