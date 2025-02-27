"use client";

import {
  ChevronRight,
  CopyMinusIcon,
  CopyPlusIcon,
  FileCode2Icon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import TaskMenuButton from "./task-menu-button";
import { WorkflowTaskType } from "@/lib/types";

const items = [
  {
    category: "Data Extraction",
    icon: FileCode2Icon,
    isOpen: true,
    taskTypes: [
      WorkflowTaskType.GetPageHtml,
      WorkflowTaskType.ExtractTextFromElement,
    ],
  },
];

export default function TaskMenu() {
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const [stateItems, setItems] = useState(items);

  function handleCollapsibleState(title: string, isOpen: boolean) {
    setItems((prev) =>
      prev.map((prev) =>
        prev.category === title ? { ...prev, isOpen } : prev,
      ),
    );
  }

  function handleCollapseAll() {
    setItems((prev) => prev.map((prev) => ({ ...prev, isOpen: false })));
  }

  function handleExpandAll() {
    setItems((prev) => prev.map((prev) => ({ ...prev, isOpen: true })));
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        Tasks
        <div className="flex items-center opacity-0 transition-opacity duration-200 ease-linear group-hover:opacity-100">
          <TooltipWrapper tooltipContent="Expand all">
            <Button
              onClick={handleExpandAll}
              variant="ghost"
              className="size-6"
            >
              <CopyPlusIcon />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltipContent="Collaspe all">
            <Button
              onClick={handleCollapseAll}
              variant="ghost"
              className="size-6"
            >
              <CopyMinusIcon />
            </Button>
          </TooltipWrapper>
        </div>
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-2">
        {stateItems.map((item) => (
          <Collapsible
            key={item.category}
            open={item.isOpen}
            onOpenChange={
              sidebarState !== "collapsed"
                ? () => handleCollapsibleState(item.category, !item.isOpen)
                : () => handleCollapsibleState(item.category, true)
            }
            className="group/collapsible"
            asChild
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                onClick={() => {
                  if (sidebarState === "collapsed") {
                    toggleSidebar();
                  }
                }}
                asChild
              >
                <SidebarMenuButton tooltip={item.category}>
                  {item.icon && <item.icon />}
                  <span className="truncate">{item.category}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.taskTypes.map((taskType, index) => (
                    <SidebarMenuSubItem key={index}>
                      <TaskMenuButton taskType={taskType} />
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
