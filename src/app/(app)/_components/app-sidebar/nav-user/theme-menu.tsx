"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react";

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuRadioGroup
      value={theme}
      onValueChange={(value) => setTheme(value)}
    >
      <DropdownMenuLabel className="font-normal">Theme</DropdownMenuLabel>
      <DropdownMenuRadioItem value="light">
        <SunIcon />
        Light
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">
        <MoonIcon />
        Dark
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system">
        <LaptopMinimalIcon />
        System
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}
