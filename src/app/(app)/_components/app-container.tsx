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
      className={cn("flex flex-1 flex-col", {
        "fixed inset-0 top-px pt-12 pl-0 md:pl-12": isSidebarExpandable,
        container: !removeContainerClass,
        "pt-20! pl-8! md:pl-20!": isSidebarExpandable && !removeContainerClass,
      })}
    >
      {children}
    </div>
  );
}

function checkRemoveContainerClass(pathname: string) {
  const pathnameParts = pathname.split("/");

  return pathnameParts.some((part) => removeContainerClassPaths.includes(part));
}
