import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { CalendarIcon, CircleDashedIcon, CoinsIcon } from "lucide-react";
import WorkflowExecutionDetail from "../../../../../_components/workflow-execution-detail";
import ViewAllExecutionsButton from "../../../../../_components/sidebar/view-all-executions-button";
import WorkflowGroupLabel from "./workflow-group-label";
import getWorkflow from "../../../../_data-access/get-workflow";
import { executionStatusColors } from "@/app/(app)/workflows/workflow/common";
import {
  cn,
  getFormattedWorkflowExecutionStatus,
  stringToDate,
} from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import useWorkflowsStore from "@/lib/store/workflows-store";
import AnimatedCounter from "@/components/animated-counter";
import useUserStore from "@/lib/store/user-store";

type Props = {
  workflow: Awaited<ReturnType<typeof getWorkflow>>;
};

export default function Workflow({ workflow }: Props) {
  const { editorWorkflowCreditCost } = useWorkflowsStore();
  const { userCreditBalance } = useUserStore();
  const lastExecutedAtDate = stringToDate(workflow?.lastExecutedAt);

  return (
    <SidebarGroup className="py-4">
      <WorkflowGroupLabel
        workflowId={workflow!.workflowId}
        workflowName={workflow!.name}
      />
      <SidebarGroupContent>
        <SidebarMenu>
          <WorkflowExecutionDetail
            icon={CircleDashedIcon}
            label="Last status"
            value={
              workflow?.lastExecutionStatus ? (
                <span
                  className={
                    executionStatusColors[workflow.lastExecutionStatus]
                  }
                >
                  {getFormattedWorkflowExecutionStatus(
                    workflow.lastExecutionStatus,
                  )}
                </span>
              ) : (
                "-"
              )
            }
          />
          <WorkflowExecutionDetail
            icon={CalendarIcon}
            label="Last executed"
            value={
              lastExecutedAtDate
                ? formatDistanceToNow(lastExecutedAtDate, {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <WorkflowExecutionDetail
            icon={CoinsIcon}
            label="Credit cost"
            value={
              <span
                className={cn("text-foreground", {
                  "text-destructive":
                    userCreditBalance !== null &&
                    userCreditBalance < editorWorkflowCreditCost,
                })}
              >
                <AnimatedCounter value={editorWorkflowCreditCost} />
              </span>
            }
          />
          <ViewAllExecutionsButton
            workflowId={workflow!.workflowId}
            disabled={!lastExecutedAtDate}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
