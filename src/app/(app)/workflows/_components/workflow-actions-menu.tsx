"use client";

import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CopyIcon,
  HistoryIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import DeleteWorkflowDialog from "./delete-workflow-dialog";
import { useState } from "react";
import Link from "next/link";
import DuplicateWorkflowDialog from "./duplicate-workflow/duplicate-workflow-dialog";
import RenameWorkflowDialog from "./rename-workflow/rename-workflow-dialog";

type Props = {
  workflowId: string;
  workflowName: string;
  workflowDescription: string | null;
  isLoading: boolean;
};

export default function WorkflowActionsMenu({
  workflowId,
  workflowName,
  workflowDescription,
  isLoading,
}: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [openDuplicateWorkflowDialog, setOpenDuplicateWorkflowDialog] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <TooltipWrapper tooltipContent="More actions">
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button variant="outline" size="sm" className="ring-offset-card">
              <MoreVerticalIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipWrapper>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <Link href={`/workflows/workflow/${workflowId}/executions`}>
            <DropdownMenuItem>
              <HistoryIcon />
              Executions
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setOpenRenameDialog(true)}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDuplicateWorkflowDialog(true)}
          >
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Trash2Icon size={16} className="stroke-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameWorkflowDialog
        open={openRenameDialog}
        setOpen={setOpenRenameDialog}
        workflowId={workflowId}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
      />
      <DuplicateWorkflowDialog
        open={openDuplicateWorkflowDialog}
        setOpen={setOpenDuplicateWorkflowDialog}
        workflowId={workflowId}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
      />
      <DeleteWorkflowDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
    </>
  );
}
