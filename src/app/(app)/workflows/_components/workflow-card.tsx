import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileTextIcon, PencilIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import WorkflowActionsMenu from "./workflow-actions-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowStatusDb } from "@/lib/types/workflow";
import ExecuteWorkflowButton from "./execute-workflow-button";
import { useState } from "react";
import ScheduleSection from "./schedule-section";
import ExecutionDetails from "./execution-details";
import getWorkflows from "../_data-access/get-workkflows";

const statusColors: Record<WorkflowStatusDb, string> = {
  DRAFT: "bg-yellow-400 text-yellow-600",
  PUBLISHED: "bg-primary",
};

type Props = {
  workflow: Exclude<Awaited<ReturnType<typeof getWorkflows>>, null>[number];
};

export default function WorkflowCard({ workflow }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const isDraft = workflow.status === "DRAFT";

  return (
    <Card className="hover:dark:shadow-primary/30 rounded-md hover:shadow-md">
      <CardContent className="flex h-[100px] items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              "flex-center size-10 rounded-full p-0 [&>svg]:size-5",
              statusColors[workflow.status],
            )}
          >
            {isDraft ? <FileTextIcon /> : <PlayIcon />}
          </Badge>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h3 className="text-muted-foreground text-xl font-bold">
                <Link
                  href={`/workflows/workflow/${workflow.workflowId}/editor`}
                  className="ring-offset-card hover:underline"
                >
                  {workflow.name}
                </Link>
              </h3>
              {isDraft && (
                <Badge className="rounded-full bg-yellow-100 text-yellow-800">
                  Draft
                </Badge>
              )}
            </div>
            <ScheduleSection
              workflowId={workflow.workflowId}
              isDraft={isDraft}
              creditCost={workflow.creditCost}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === "PUBLISHED" && (
            <ExecuteWorkflowButton
              workflowId={workflow.workflowId}
              setIsLoading={setIsLoading}
              creditCost={workflow.creditCost}
            />
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={isLoading}
            className={cn("ring-offset-card", {
              "pointer-events-none opacity-50": isLoading,
            })}
          >
            <Link
              aria-disabled={isLoading}
              href={`/workflows/workflow/${workflow.workflowId}/editor`}
            >
              <PencilIcon />
              Edit
            </Link>
          </Button>
          <WorkflowActionsMenu
            isLoading={isLoading}
            workflowName={workflow.name}
            workflowDescription={workflow.description}
            workflowId={workflow.workflowId}
          />
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <ExecutionDetails workflow={workflow} />
      </CardFooter>
    </Card>
  );
}
