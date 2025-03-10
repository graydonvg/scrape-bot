"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeButton from "./theme-button";
import { ThemeMenuItems } from "./theme-menu-items";

export function ThemeMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-offset-background focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
        <ThemeButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
