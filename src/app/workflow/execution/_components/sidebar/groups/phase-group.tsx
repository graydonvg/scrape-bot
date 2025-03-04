import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  CircleAlert,
  CircleCheckBigIcon,
  CircleXIcon,
  ListOrdered,
  Loader2Icon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WorkflowTaskDb } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, getUniquePhaseNumbers } from "@/lib/utils";

type Props = {
  tasks?: WorkflowTaskDb[];
};

export default function PhaseGroup({ tasks }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");
  const uniquePhaseNumbers = tasks ? getUniquePhaseNumbers(tasks) : [];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
        <ListOrdered size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Phases</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {uniquePhaseNumbers.length > 0 ? (
          uniquePhaseNumbers.map((phaseNumber) => {
            const phaseTasks = tasks?.filter(
              (task) => task.phase === phaseNumber,
            );
            const isLoading = phaseTasks?.some(
              (task) => task.status !== "COMPLETED" && task.status !== "FAILED",
            );
            const allCompleted = phaseTasks?.every(
              (task) => task.status === "COMPLETED",
            );
            const allFailed = phaseTasks?.every(
              (task) => task.status === "FAILED",
            );

            return (
              <Collapsible
                key={phaseNumber}
                defaultOpen={true}
                className="group/collapsible"
                asChild
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={`Phase: ${phaseNumber}`}>
                      {isLoading && (
                        <Loader2Icon
                          size={20}
                          className="stroke-muted-foreground animate-spin"
                        />
                      )}
                      {allCompleted && (
                        <CircleCheckBigIcon
                          size={20}
                          className="stroke-success dark:stroke-green-500"
                        />
                      )}
                      {!isLoading && !allCompleted && !allFailed && (
                        <CircleAlert size={20} className="stroke-warning" />
                      )}
                      {allFailed && (
                        <CircleXIcon size={20} className="stroke-destructive" />
                      )}
                      <span className="truncate">{`Phase: ${phaseNumber}`}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {phaseTasks?.map((task, index) => {
                        const isLoading =
                          task.status !== "COMPLETED" &&
                          task.status !== "FAILED";
                        const isCompleted = task.status === "COMPLETED";
                        const isFailed = task.status === "FAILED";

                        return (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              isActive={taskId === task.taskId}
                              onClick={() => {
                                if (task.status === "EXECUTING") return;

                                router.push(`?task=${task.taskId}`);
                              }}
                              className="cursor-pointer"
                            >
                              {isLoading && (
                                <Loader2Icon
                                  size={20}
                                  className="stroke-muted-foreground animate-spin"
                                />
                              )}
                              {isCompleted && (
                                <CircleCheckBigIcon
                                  size={20}
                                  className="stroke-success dark:stroke-green-500"
                                />
                              )}
                              {isFailed && (
                                <CircleXIcon
                                  size={20}
                                  className="stroke-destructive"
                                />
                              )}
                              <div className="flex w-full items-center justify-between">
                                <span className="truncate font-semibold">
                                  {task.name}
                                </span>
                                <span
                                  className={cn(
                                    "text-muted-foreground text-xs",
                                    {
                                      "text-success dark:text-green-500":
                                        isCompleted,
                                      "text-destructive": isFailed,
                                    },
                                  )}
                                >
                                  {task.status}
                                </span>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })
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
}
