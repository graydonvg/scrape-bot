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
import CountUpComponent from "../count-up-component";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  containerClassName?: string;
};

export default function AvailableCredits({ containerClassName }: Props) {
  const { workflowExecutionData } = useWorkflowsStore();
  const query = useQuery({
    queryKey: ["available-credits"],
    queryFn: () => getUserAvailableCredits(),
    refetchInterval: () =>
      workflowExecutionData?.status === "EXECUTING" ? 30 * 1000 : false, // 30 seconds or false
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
                  <span className="font-semibold">
                    <CountUpComponent value={query.data.credits} />
                  </span>
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
