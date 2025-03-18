// import { CopyMinusIcon, CopyPlusIcon } from "lucide-react";
// import TooltipWrapper from "@/components/tooltip-wrapper";
// import { Button } from "@/components/ui/button";

// type Props = {
//   onExpandAll: () => void;
//   onCollapseAll: () => void;
// };

// export default function TasksGroupLabel({ onExpandAll, onCollapseAll }: Props) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-muted-foreground text-xs">Tasks</span>
//       <div className="flex items-center opacity-0 transition-opacity duration-200 ease-linear group-hover/tasks:opacity-100">
//         <TooltipWrapper tooltipContent="Expand all">
//           <Button onClick={onExpandAll} variant="ghost" className="size-6">
//             <CopyPlusIcon />
//           </Button>
//         </TooltipWrapper>
//         <TooltipWrapper tooltipContent="Collaspe all">
//           <Button onClick={onCollapseAll} variant="ghost" className="size-6">
//             <CopyMinusIcon />
//           </Button>
//         </TooltipWrapper>
//       </div>
//     </div>
//   );
// }

import { CopyMinusIcon, CopyPlusIcon, ListCollapseIcon } from "lucide-react";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";

type Props = {
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

export default function TasksGroupLabel({ onExpandAll, onCollapseAll }: Props) {
  return (
    <SidebarGroupLabel className="text-muted-foreground text-base">
      <div className="flex items-center gap-2">
        <ListCollapseIcon size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Tasks</span>
      </div>
      <div className="ml-auto flex items-center opacity-0 transition-opacity duration-200 ease-linear group-hover/tasks:opacity-100">
        <TooltipWrapper tooltipContent="Expand all">
          <Button onClick={onExpandAll} variant="ghost" className="size-6">
            <CopyPlusIcon />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper tooltipContent="Collaspe all">
          <Button onClick={onCollapseAll} variant="ghost" className="size-6">
            <CopyMinusIcon />
          </Button>
        </TooltipWrapper>
      </div>
    </SidebarGroupLabel>
  );
}
