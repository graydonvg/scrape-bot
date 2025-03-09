import { SidebarGroup, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
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
  const { state: sidebarState, toggleSidebar } = useSidebar();
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
    <SidebarGroup className="group/phases grow">
      <PhasesGroupLabel
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />
      <SidebarMenu>
        {phases.length > 0 ? (
          phases.map((phase) => (
            <CollapsiblePhase
              key={phase.phaseNumber}
              phaseNumber={phase.phaseNumber}
              tasks={phase.tasks}
              isOpen={phase.isOpen}
              onOpenChange={
                sidebarState !== "collapsed"
                  ? () =>
                      handleCollapsibleState(phase.phaseNumber, !phase.isOpen)
                  : () => handleCollapsibleState(phase.phaseNumber, true)
              }
              onCollapsibleTriggerClick={() => {
                if (sidebarState === "collapsed") {
                  toggleSidebar();
                }
              }}
            />
          ))
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="bg-muted h-6 w-full" />
            ))}
          </div>
        )}
      </SidebarMenu>
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
