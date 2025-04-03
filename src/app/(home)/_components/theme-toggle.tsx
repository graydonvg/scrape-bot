"use client";

import { LaptopMinimalIcon, LucideIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeMenu } from "@/components/theme-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ActiveThemeName = "light" | "dark" | "system";

const icons: Record<ActiveThemeName, LucideIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: LaptopMinimalIcon,
};

export function ThemeToggle() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const Icon = icons[theme as ActiveThemeName];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Skeleton className="size-9 rounded-md" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="size-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} side="top">
        <ThemeMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
