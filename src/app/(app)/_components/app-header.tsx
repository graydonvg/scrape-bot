"use client";

import AvailableCredits from "@/components/available-credits";
// import BreadcrumbHeader from "@/components/breadcrumb-header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import useSidebarOpensOnHover from "@/hooks/use-sidebar-opens-on-hover";

export default function AppHeader() {
  const isMobile = useIsMobile();
  const opensOnHover = useSidebarOpensOnHover();

  return (
    <header className="bg-sidebar z-50 flex h-12 shrink-0 items-center px-4 py-2">
      <div className="flex size-full items-center justify-between">
        {(isMobile || !opensOnHover) && <SidebarTrigger />}
        {/* <BreadcrumbHeader /> */}
        <div className="ml-auto">
          <AvailableCredits />
        </div>
      </div>
    </header>
  );
}
