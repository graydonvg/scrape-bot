"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getUserAvailableCredits from "@/data-access/get-user-available-credits";

type Props = {
  containerClassName?: string;
};

export default function AvailableCredits({ containerClassName }: Props) {
  const query = useQuery({
    queryKey: ["available-credits"],
    queryFn: () => getUserAvailableCredits(),
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return (
    <SidebarGroup className={containerClassName}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="outline"
              tooltip={`Credits: ${query.data ? query.data.credits : "-"}`}
              asChild
            >
              <Link
                href="/billing"
                className="flex items-center justify-center group-data-[collapsible=icon]:justify-start"
              >
                <CoinsIcon
                  size={20}
                  className="stroke-sidebar-primary dark:stroke-blue-500"
                />
                {query.isLoading && (
                  <Loader2Icon size={20} className="animate-spin" />
                )}
                {!query.isLoading && query.data && (
                  <span className="font-semibold">{query.data.credits}</span>
                )}
                {!query.isLoading && !query.data && "-"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
