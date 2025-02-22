"use client";

import Logo from "@/components/logo";
import { ThemeMenu } from "@/components/theme/theme-menu";

export default function WorkflowFooter() {
  return (
    <footer className="bg-background flex h-16 items-center justify-between border-t-2 px-4">
      <Logo isLink />
      <ThemeMenu />
    </footer>
  );
}
