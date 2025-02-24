"use client";

import {
  ChevronRight,
  CircleHelpIcon,
  CopyMinusIcon,
  CopyPlusIcon,
  GripVerticalIcon,
  PickaxeIcon,
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { WorkflowTaskType } from "@/lib/types";
import { taskRegistry } from "@/lib/workflow/task-registry";

const items = [
  {
    title: "Data Extraction",
    icon: PickaxeIcon,
    isOpen: true,
    items: [
      {
        label: taskRegistry[WorkflowTaskType.GetPageHtml].label,
        icon: taskRegistry[WorkflowTaskType.GetPageHtml].icon,
      },
    ],
  },
  {
    title: "Task Category 2",
    icon: CircleHelpIcon,
    isOpen: true,
    items: [
      {
        label: "Task",
        icon: CircleHelpIcon,
      },
    ],
  },
  {
    title: "Task Category 3",
    icon: CircleHelpIcon,
    isOpen: true,
    items: [
      {
        label: "Task",
        icon: CircleHelpIcon,
      },
    ],
  },
];

// type Props = {

// };

export default function TaskMenu() {
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const [stateItems, setItems] = useState(items);

  function handleCollapsibleState(title: string, isOpen: boolean) {
    setItems((prev) =>
      prev.map((prev) => (prev.title === title ? { ...prev, isOpen } : prev)),
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
            key={item.title}
            open={item.isOpen}
            onOpenChange={
              sidebarState !== "collapsed"
                ? () => handleCollapsibleState(item.title, !item.isOpen)
                : () => handleCollapsibleState(item.title, true)
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
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className="truncate">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton className="flex cursor-grab items-center justify-between select-none active:cursor-grabbing">
                        <div className="flex items-center gap-2">
                          {subItem.icon && <subItem.icon size={16} />}
                          <span className="truncate">{subItem.label}</span>
                        </div>
                        <GripVerticalIcon size={16} />
                      </SidebarMenuSubButton>
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
