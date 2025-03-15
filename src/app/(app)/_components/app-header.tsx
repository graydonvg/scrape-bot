"use client";

import AvailableCredits from "@/components/available-credits";
// import BreadcrumbHeader from "@/components/breadcrumb-header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

const hideSidebarTriggerPaths = ["/editor", "/execution/"];

export default function AppHeader() {
  const pathname = usePathname();
  const hideSidebarTrigger = hideSidebarTriggerPaths.some((path) =>
    pathname.includes(path),
  );
  const isMobile = useIsMobile();

  return (
    <header className="bg-sidebar z-50 flex h-16 shrink-0 items-center px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex size-full items-center justify-between">
        {isMobile || !hideSidebarTrigger ? <SidebarTrigger /> : null}
        {/* <BreadcrumbHeader /> */}
        <div className="ml-auto">
          <AvailableCredits />
        </div>
      </div>
    </header>
  );
}
