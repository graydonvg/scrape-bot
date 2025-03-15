"use client";

import { usePathname } from "next/navigation";

const opensOnHoverPaths = ["/editor", "/execution/"];

export default function useSidebarOpensOnHover() {
  const pathname = usePathname();
  const opensOnHover = opensOnHoverPaths.some((path) =>
    pathname.includes(path),
  );

  return opensOnHover;
}
