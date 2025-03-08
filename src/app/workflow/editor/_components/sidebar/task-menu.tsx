"use client";

import { FileCode2Icon } from "lucide-react";
import { SidebarGroup, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import TasksGroupLabel from "./tasks-group-label";
import CollapsibleCategory from "./collapsible-category";
import { WorkflowTaskType } from "@/lib/types/workflow";

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

  return (
    <SidebarGroup className="group/tasks grow">
      <TasksGroupLabel
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />
      <SidebarMenu>
        {stateItems.map((item) => (
          <CollapsibleCategory
            key={item.category}
            category={item.category}
            icon={item.icon}
            isOpen={item.isOpen}
            taskTypes={item.taskTypes}
            onOpenChange={
              sidebarState !== "collapsed"
                ? () => handleCollapsibleState(item.category, !item.isOpen)
                : () => handleCollapsibleState(item.category, true)
            }
            onCollapsibleTriggerClick={() => {
              if (sidebarState === "collapsed") {
                toggleSidebar();
              }
            }}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

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
}
