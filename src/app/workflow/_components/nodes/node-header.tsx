"use client";

import TooltipWrapper from "@/components/tooltip-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowTaskType } from "@/lib/types";
import { createWorkflowNode } from "@/lib/utils";
import { taskRegistry } from "@/lib/workflow/task-registry";
import { useReactFlow } from "@xyflow/react";
import {
  CoinsIcon,
  CopyIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react";

type Props = {
  nodeId: string;
  taskType: WorkflowTaskType;
};

export default function NodeHeader({ nodeId, taskType }: Props) {
  const task = taskRegistry[taskType];
  const { deleteElements, getNode, addNodes, updateNode } = useReactFlow();

  function createNodeCopy() {
    const currentNode = getNode(nodeId);

    if (!currentNode) return;

    const currentNodeX = currentNode.position.x;
    const currentNodeY = currentNode.position.y;

    const currentNodeWidth = currentNode.measured?.width || 150;
    const currentNodeHeight = currentNode.measured?.height || 150;

    const newNodeX = currentNodeX + currentNodeWidth / 2;
    const newNodeY = currentNodeY + currentNodeHeight / 2;

    const newNode = createWorkflowNode(taskType, { x: newNodeX, y: newNodeY });

    newNode.selected = true;

    addNodes(newNode);

    updateNode(nodeId, {
      selected: false,
    });
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex w-full items-center justify-between">
        <p className="text-muted-foreground text-xs font-bold uppercase">
          {task.label}
        </p>
        <div className="flex items-center gap-1">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <TooltipWrapper tooltipContent="Credits consumed when executed">
            <Badge className="flex items-center gap-2 text-xs">
              <CoinsIcon />
              {task.credits}
            </Badge>
          </TooltipWrapper>
          {!task.isEntryPoint && (
            <>
              <TooltipWrapper tooltipContent="Delete node">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    deleteElements({
                      nodes: [{ id: nodeId }],
                    })
                  }
                >
                  <Trash2Icon />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper tooltipContent="Copy node">
                <Button variant="ghost" size="icon" onClick={createNodeCopy}>
                  <CopyIcon />
                </Button>
              </TooltipWrapper>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab active:cursor-grabbing"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
