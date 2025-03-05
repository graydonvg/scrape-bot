"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain() {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const paths = pathname === "/" ? ["/"] : pathname.split("/");
  const routes = siteConfig.navMain;
  const activeRoute = routes.find((route) => paths.includes(route.href));

  return (
    <SidebarGroup>
      <nav>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.label}>
              <SidebarMenuButton
                asChild
                tooltip={route.label}
                isActive={activeRoute && activeRoute.href === route.href}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <Link href={route.href}>
                  <route.icon />
                  <span>{route.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
    </SidebarGroup>
  );
}
