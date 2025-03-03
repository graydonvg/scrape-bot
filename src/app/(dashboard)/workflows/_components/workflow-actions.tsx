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

import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import DeleteWorkflowDialog from "./delete-workflow-dialog";
import { useState } from "react";

type Props = {
  workflowName: string;
  workflowId: string;
};

export default function WorkflowActionsMenu({
  workflowName,
  workflowId,
}: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <TooltipWrapper tooltipContent="More actions">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ring-offset-card">
              <MoreVerticalIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipWrapper>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Trash2Icon size={16} className="stroke-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkflowDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
    </>
  );
}
