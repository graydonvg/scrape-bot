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
  const paths = pathname === "/" ? [""] : pathname.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const isLastItem = paths.length === index + 1;

          if (isLastItem) {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="capitalize">
                  {path === "" ? "home" : path}
                </BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${path}`} className="capitalize">
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
