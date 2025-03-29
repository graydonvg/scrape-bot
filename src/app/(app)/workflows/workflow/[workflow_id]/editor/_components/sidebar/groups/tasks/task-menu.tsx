"use client";

import { ClockIcon, FileCode2Icon, HandIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useState } from "react";
import TasksGroupLabel from "./tasks-group-label";
import CollapsibleTaskCategory from "./collapsible-task-category";
import { TaskType } from "@/lib/types/task";

const items = [
  {
    category: "Data Extraction",
    icon: FileCode2Icon,
    isOpen: true,
    taskTypes: [TaskType.GetPageHtml, TaskType.ExtractTextFromElement],
  },
  {
    category: "User Interaction",
    icon: HandIcon,
    isOpen: true,
    taskTypes: [TaskType.FillInputField, TaskType.ClickElement],
  },
  {
    category: "Timing Controls",
    icon: ClockIcon,
    isOpen: true,
    taskTypes: [TaskType.WaitForElement],
  },
];

export default function TaskMenu() {
  const [stateItems, setItems] = useState(items);

  return (
    <SidebarGroup
      className="group/tasks relative h-full overflow-y-auto pt-0 pb-4"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <div className="bg-sidebar sticky top-0 z-10 pt-4 pb-2">
        <TasksGroupLabel
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />
      </div>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {stateItems.map((item) => (
            <CollapsibleTaskCategory
              key={item.category}
              category={item.category}
              icon={item.icon}
              isOpen={item.isOpen}
              taskTypes={item.taskTypes}
              onOpenChange={() =>
                handleCollapsibleState(item.category, !item.isOpen)
              }
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
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
