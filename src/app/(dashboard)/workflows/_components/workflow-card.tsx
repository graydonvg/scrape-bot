import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileTextIcon, PencilIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import WorkflowActionsMenu from "./workflow-actions-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowDb, WorkflowStatusDb } from "@/lib/types/workflow";

type Props = {
  workflow: WorkflowDb;
};

const statusColors: Record<WorkflowStatusDb, string> = {
  DRAFT: "bg-yellow-400 text-yellow-600",
  PUBLISHED: "bg-primary",
};

export default function WorkflowCard({ workflow }: Props) {
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
          <div className="flex items-center gap-2">
            <h3 className="text-muted-foreground text-xl font-bold">
              <Link
                href={`/workflow/editor/${workflow.workflowId}`}
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
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ring-offset-card"
          >
            <Link href={`/workflow/editor/${workflow.workflowId}`}>
              <PencilIcon />
              Edit
            </Link>
          </Button>
          <WorkflowActionsMenu
            workflowName={workflow.name}
            workflowId={workflow.workflowId}
          />
        </div>
      </CardContent>
    </Card>
  );
}
