"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const filteredPaths = paths.filter((path) => path.length > 0);

  if (filteredPaths.length < 2) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {filteredPaths.map((path, index) => {
          const isLastItem = filteredPaths.length === index + 1;

          if (isLastItem) {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="text-xs capitalize">
                  {path === "" ? "home" : path}
                </BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${path}`}
                  className="text-xs capitalize"
                >
                  {path === "" ? "home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
