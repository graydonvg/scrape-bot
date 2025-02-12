"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../logo";
import { buttonVariants } from "../ui/button";
import { routes } from "@/lib/constants";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length && pathname.includes(route.href),
    ) || routes[0];

  return (
    <div className="relative hidden h-screen w-full max-w-[280px] overflow-hidden border-r bg-primary/5 text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block">
      <div className="flex-center gap-2 border-b p-4">
        <Logo />
      </div>
      <div className="p-2">Todo credits</div>
      <nav>
        <ul className="space-y-2 p-2">
          {routes.map((route, index) => (
            <li key={index}>
              <Link
                href={route.href}
                className={cn(
                  "w-full",
                  buttonVariants({
                    variant:
                      route.href === activeRoute.href
                        ? "sidebarActive"
                        : "sidebar",
                  }),
                )}
              >
                <route.icon size={20} />
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
