import { Separator } from "@/components/ui/separator";
import ActionButtons from "./action-buttons";
import TaskMenu from "./task-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  CircleDashedIcon,
  CoinsIcon,
  Loader2Icon,
  NetworkIcon,
  PencilIcon,
} from "lucide-react";
import WorkflowExecutionDetail from "@/app/(app)/workflows/workflow/_components/workflow-execution-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import renameWorkflowAction from "../../_actions/rename-workflow-action";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import ViewAllExecutionsButton from "../../../_components/sidebar/view-all-executions-button";

type Props = {
  workflowId: string;
  workflowName: string;
};

export default function WorkflowEditorSidebar({
  workflowId,
  workflowName,
}: Props) {
  const [renameWorkflow, setRenameWorkflow] = useState(false);
  const [newName, setNewName] = useState(workflowName);
  const { execute, isPending } = useAction(renameWorkflowAction, {
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        setNewName(workflowName);

        return toast.error(data.message);
      }
    },
    onError: () => {
      toast.error(USER_ERROR_MESSAGES.Unexpected);
    },
  });

  function handleRenameWorkflow() {
    setRenameWorkflow(false);

    if (newName === workflowName) return;

    execute({ workflowId, workflowName: newName });
  }

  return (
    <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:ml-12 md:w-[320px] md:max-w-[320px] md:min-w-[320px]">
      <SidebarGroup className="py-4">
        <SidebarGroupLabel className="mb-2 rounded-none border-b px-0">
          {!renameWorkflow ? (
            <Button
              onClick={() => setRenameWorkflow(true)}
              variant="ghost"
              size="sm"
              disabled={isPending}
              className="text-foreground z-50 flex w-full items-center justify-between !px-2 text-base"
            >
              <div className="flex items-center gap-2">
                <NetworkIcon className="stroke-muted-foreground/80 -rotate-90" />
                <span className="truncate">{newName}</span>
              </div>
              {!isPending && (
                <PencilIcon className="stroke-muted-foreground/80" />
              )}
              {isPending && (
                <Loader2Icon className="stroke-muted-foreground/80 animate-spin" />
              )}
            </Button>
          ) : (
            <Input
              autoFocus
              onBlur={handleRenameWorkflow}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameWorkflow();
                }
              }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-foreground px-2.5 text-base font-medium"
            />
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <WorkflowExecutionDetail
              icon={CircleDashedIcon}
              label="Last Status"
              value="-"
            />
            <WorkflowExecutionDetail
              icon={CalendarIcon}
              label="Last Executed"
              value="-"
            />
            <WorkflowExecutionDetail
              icon={CoinsIcon}
              label="Credit cost"
              value={
                // TODO: Make value dynamic
                // <AnimatedCounter value={12} />
                "TODO"
              }
            />
            <ViewAllExecutionsButton workflowId={workflowId} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <Separator />
      <TaskMenu />
      <Separator />
      <div className="p-4">
        <ActionButtons workflowId={workflowId} />
      </div>
    </div>
  );
}
