import { Workflow, WorkflowNode, WorkflowTaskType } from "@/lib/types";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ColorMode,
  useReactFlow,
  Connection,
  addEdge,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Node from "./nodes/node";
import { useTheme } from "next-themes";
import { DragEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import { useLogger } from "next-axiom";
import { createWorkflowNode } from "@/lib/utils";
import DeleteableEdge from "./edges/deleteable-edge";

const fitViewOptions = {
  padding: 1,
};

type Props = {
  workflow: Partial<Workflow>;
};

export default function Flow({ workflow }: Props) {
  const logger = useLogger();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const nodeTypes = useMemo(() => ({ node: Node }), []);
  const edgeTypes = useMemo(() => ({ default: DeleteableEdge }), []);
  const { setViewport, screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // Required to prevent hydration error when setting ReactFlow colorMode using next-themes
    setIsMounted(true);
  }, []);

  useEffect(() => {
    try {
      const workflowDefinition = JSON.parse(workflow.definition as string);

      if (!workflowDefinition) throw new Error("Workflow definition missing");

      setNodes(workflowDefinition.nodes || []);
      setEdges(workflowDefinition.edges || []);

      if (!workflowDefinition.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = workflowDefinition.viewport;

      setViewport({ x, y, zoom });
    } catch (error) {
      setNodes([]);
      setEdges([]);

      logger.error("Error parsing workflow definition", { error });

      toast.error(USER_ERROR_MESSAGES.Unexpected);
    } finally {
      logger.flush();
    }
  }, [workflow.definition, setEdges, setNodes, setViewport, logger]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const taskType = e.dataTransfer.getData("application/reactflow");

      if (!taskType || typeof taskType === "undefined") return;

      const poisiton = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      const newNode = createWorkflowNode(
        taskType as WorkflowTaskType,
        poisiton,
      );

      setNodes((prev) => prev.concat(newNode));
    },
    [setNodes, screenToFlowPosition],
  );

  const handleOnConnect = useCallback(
    (connection: Connection) => {
      console.log("@handleOnConnect", connection);
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            animated: true,
          },
          edges,
        ),
      );
    },
    [setEdges],
  );

  if (!isMounted) return null;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      colorMode={`${theme}` as ColorMode}
      fitViewOptions={fitViewOptions}
      fitView
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onConnect={handleOnConnect}
    >
      <Controls position="top-left" fitViewOptions={fitViewOptions} />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
