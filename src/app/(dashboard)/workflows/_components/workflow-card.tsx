import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { FileTextIcon, PencilIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import WorkflowActionsMenu from "./workflow-actions";
import { Button } from "@/components/ui/button";

type Props = {
  workflow: Database["public"]["Tables"]["workflows"]["Row"];
};

const statusColors: Record<
  Database["public"]["Enums"]["workflow_status"],
  string
> = {
  DRAFT: "bg-violet-400 text-violet-600",
  PUBLISHED: "bg-primary",
};

export default function WorkflowCard({ workflow }: Props) {
  const isDraft = workflow.status === "DRAFT";
  return (
    <Card className="dark:shadow-primary/30 shadow-xs hover:shadow-md">
      <CardContent className="flex h-[100px] items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex-center size-10 rounded-full",
              statusColors[workflow.status],
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5" />
            )}
          </div>
          <div>
            <h3 className="text-muted-foreground text-base font-bold">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/workflow/editor/${workflow.id}`}>
              <PencilIcon size={16} />
              Edit
            </Link>
          </Button>
          <WorkflowActionsMenu
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
