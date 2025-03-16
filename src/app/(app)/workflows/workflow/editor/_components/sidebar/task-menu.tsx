// "use client";

// import { FileCode2Icon } from "lucide-react";
// import { useState } from "react";
// import TasksGroupLabel from "./tasks-group-label";
// import CollapsibleCategory from "./collapsible-category";
// import { TaskType } from "@/lib/types/task";

// const items = [
//   {
//     category: "Data Extraction",
//     icon: FileCode2Icon,
//     isOpen: true,
//     taskTypes: [TaskType.GetPageHtml, TaskType.ExtractTextFromElement],
//   },
// ];

// export default function TaskMenu() {
//   const [stateItems, setItems] = useState(items);

//   return (
//     <div className="group/tasks grow space-y-2">
//       <TasksGroupLabel
//         onExpandAll={handleExpandAll}
//         onCollapseAll={handleCollapseAll}
//       />
//       <div className="space-y-4">
//         {stateItems.map((item) => (
//           <CollapsibleCategory
//             key={item.category}
//             category={item.category}
//             icon={item.icon}
//             isOpen={item.isOpen}
//             taskTypes={item.taskTypes}
//             onOpenChange={() =>
//               handleCollapsibleState(item.category, !item.isOpen)
//             }
//           />
//         ))}
//       </div>
//     </div>
//   );

//   function handleCollapsibleState(title: string, isOpen: boolean) {
//     setItems((prev) =>
//       prev.map((prev) =>
//         prev.category === title ? { ...prev, isOpen } : prev,
//       ),
//     );
//   }

//   function handleCollapseAll() {
//     setItems((prev) => prev.map((prev) => ({ ...prev, isOpen: false })));
//   }

//   function handleExpandAll() {
//     setItems((prev) => prev.map((prev) => ({ ...prev, isOpen: true })));
//   }
// }

"use client";

import { FileCode2Icon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useState } from "react";
import TasksGroupLabel from "./tasks-group-label";
import CollapsibleCategory from "./collapsible-category";
import { TaskType } from "@/lib/types/task";

const items = [
  {
    category: "Data Extraction",
    icon: FileCode2Icon,
    isOpen: true,
    taskTypes: [TaskType.GetPageHtml, TaskType.ExtractTextFromElement],
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
        <SidebarMenu>
          {stateItems.map((item) => (
            <CollapsibleCategory
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
