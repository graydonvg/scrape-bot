"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const removeContainerClassPaths = ["editor", "execution"];

type Props = {
  children: ReactNode;
};

export default function AppContainer({ children }: Props) {
  const { sidebarBehaviour } = useSidebar();
  const isSidebarExpandable = sidebarBehaviour === "expandable";
  const pathname = usePathname();
  const removeContainerClass = checkRemoveContainerClass(pathname);

  return (
    <div
      className={cn("flex flex-1 flex-col overflow-y-auto", {
        "fixed inset-0 mt-12 h-[calc(100vh-(--spacing(12)))] md:left-12":
          isSidebarExpandable,
      })}
    >
      <div
        className={cn("flex flex-1 flex-col", {
          container: !removeContainerClass,
        })}
      >
        {children}
      </div>
    </div>
  );
}

function checkRemoveContainerClass(pathname: string) {
  const pathnameParts = pathname.split("/");

  return pathnameParts.some((part) => removeContainerClassPaths.includes(part));
}
