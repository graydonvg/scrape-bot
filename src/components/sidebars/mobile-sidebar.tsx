"use client";

import { routes } from "@/lib/constants";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Menu } from "lucide-react";
import Logo from "../logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length && pathname.includes(route.href),
    ) || routes[0];

  return (
    <div className="bg-background md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-8">
            <Logo />
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SheetDescription className="sr-only">
              Select a route.
            </SheetDescription>
          </SheetHeader>
          <nav>
            <ul className="space-y-2">
              {routes.map((route, index) => (
                <li key={index} className="">
                  <Link
                    href={route.href}
                    onClick={() => setIsOpen(false)}
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
