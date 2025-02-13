import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bot } from "lucide-react";
import Link from "next/link";

export default function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" className="hover:bg-sidebar">
          <Link href="/" aria-label="navigate to home page">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-sidebar-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div className="text-left text-2xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Scrape
              </span>
              <span className="text-stone-700 dark:text-stone-300">Bot</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
