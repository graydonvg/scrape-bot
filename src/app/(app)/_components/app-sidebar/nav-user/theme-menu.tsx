"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react";

const items = [
  {
    value: "light",
    icon: <SunIcon />,
  },
  {
    value: "dark",
    icon: <MoonIcon />,
  },
  {
    value: "system",
    icon: <LaptopMinimalIcon />,
  },
];

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuRadioGroup
      value={theme}
      onValueChange={(value) => setTheme(value)}
    >
      <DropdownMenuLabel className="font-normal">Theme</DropdownMenuLabel>
      {items.map((item) => (
        <DropdownMenuRadioItem
          key={item.value}
          value={item.value}
          className="cursor-pointer capitalize"
        >
          {item.icon}
          {item.value}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
