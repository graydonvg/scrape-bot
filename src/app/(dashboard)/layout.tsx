import BreadcrumbHeader from "@/components/breadcrumb-header";
import DesktopSidebar from "@/components/sidebars/desktop-sidebar";
import MobileSidebar from "@/components/sidebars/mobile-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <div className="flex size-full flex-col">
        <header className="container flex h-[50px] items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <BreadcrumbHeader />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <div className="overflow-auto">
          <div className="container size-full py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
