"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain() {
  const pathname = usePathname();
  const paths = pathname === "/" ? ["/"] : pathname.split("/");
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
