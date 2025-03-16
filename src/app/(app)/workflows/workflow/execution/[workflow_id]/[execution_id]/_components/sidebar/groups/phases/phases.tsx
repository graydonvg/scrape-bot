import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import CollapsiblePhase from "./collapsible-phase";
import PhasesGroupLabel from "./phases-group-label";
import { useCallback, useEffect, useState } from "react";
import getUniquePhaseNumbers from "@/lib/workflow/helpers/get-unique-phase-numbers";
import { TaskDb } from "@/lib/types/task";

type Props = {
  tasks?: TaskDb[];
};

export default function Phases({ tasks }: Props) {
  const [phases, setPhases] = useState<ReturnType<typeof getPhasesData>>([]);

  const getPhasesData = useCallback(() => {
    const uniquePhaseNumbers = tasks ? getUniquePhaseNumbers(tasks) : [];

    const phasesData = uniquePhaseNumbers.map((phaseNumber) => {
      const phaseTasks = tasks?.filter((task) => task.phase === phaseNumber);

      return {
        phaseNumber,
        tasks: phaseTasks,
        isOpen: true,
      };
    });

    return phasesData;
  }, [tasks]);

  useEffect(() => {
    const phasesData = getPhasesData();

    setPhases(phasesData);
  }, [tasks, getPhasesData]);

  return (
    <SidebarGroup
      className="group/phases relative h-full overflow-y-auto pt-0 pb-4"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <div className="bg-sidebar sticky top-0 z-10 pt-4 pb-2">
        <PhasesGroupLabel
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          {phases.length > 0 ? (
            phases.map((phase) => (
              <CollapsiblePhase
                key={phase.phaseNumber}
                phaseNumber={phase.phaseNumber}
                tasks={phase.tasks}
                isOpen={phase.isOpen}
                onOpenChange={() =>
                  handleCollapsibleState(phase.phaseNumber, !phase.isOpen)
                }
              />
            ))
          ) : (
            <div className="space-y-2 px-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="bg-accent h-9 w-full" />
              ))}
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  function handleCollapsibleState(phaseNumber: number, isOpen: boolean) {
    setPhases((prev) =>
      prev.map((prev) =>
        prev.phaseNumber === phaseNumber ? { ...prev, isOpen } : prev,
      ),
    );
  }

  function handleCollapseAll() {
    setPhases((prev) => prev.map((prev) => ({ ...prev, isOpen: false })));
  }

  function handleExpandAll() {
    setPhases((prev) => prev.map((prev) => ({ ...prev, isOpen: true })));
  }
}
