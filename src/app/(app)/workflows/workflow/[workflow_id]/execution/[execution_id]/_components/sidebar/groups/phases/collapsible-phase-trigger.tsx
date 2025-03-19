import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  ChevronRight,
  CircleAlert,
  CircleCheckBigIcon,
  CircleXIcon,
  Loader2Icon,
} from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { TaskDb } from "@/lib/types/task";

type Props = {
  phaseNumber: number;
  tasks?: TaskDb[];
};

export default function CollapsiblePhaseTrigger({ phaseNumber, tasks }: Props) {
  const state = getPhaseState();

  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuButton>
        {state.isLoading && (
          <Loader2Icon
            size={20}
            className="stroke-muted-foreground animate-spin"
          />
        )}
        {state.allCompleted && (
          <CircleCheckBigIcon
            size={20}
            className="stroke-success dark:stroke-green-500"
          />
        )}
        {state.someFailed && (
          <CircleAlert size={20} className="stroke-warning" />
        )}
        {state.allFailed && (
          <CircleXIcon size={20} className="stroke-destructive" />
        )}
        <span className="truncate">{`Phase: ${phaseNumber}`}</span>
        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );

  function getPhaseState() {
    const isLoading = tasks?.some(
      (task) => task.status !== "COMPLETED" && task.status !== "FAILED",
    );
    const allCompleted = tasks?.every((task) => task.status === "COMPLETED");
    const allFailed = tasks?.every((task) => task.status === "FAILED");
    const someFailed = !isLoading && !allCompleted && !allFailed;

    return {
      isLoading,
      allCompleted,
      someFailed,
      allFailed,
    };
  }
}
