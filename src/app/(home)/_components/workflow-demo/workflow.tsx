"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ColorMode,
  Connection,
  MarkerType,
  useReactFlow,
  getOutgoers,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { WorkflowNode } from "@/lib/types/workflow";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Node from "@/app/(app)/workflows/workflow/[workflow_id]/editor/_components/nodes/node";
import DeleteableEdge from "@/app/(app)/workflows/workflow/[workflow_id]/editor/_components/edges/deleteable-edge";
import { homeConfig } from "@/config/home";

const fitViewOptions = {
  padding: 1,
};

export default function Workflow() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const nodeTypes = useMemo(() => ({ node: Node }), []);
  const edgeTypes = useMemo(() => ({ default: DeleteableEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { updateNodeData } = useReactFlow();
  const lastInvalidConnection = useRef<string | null>(null);

  useEffect(() => {
    // Required to prevent hydration error when setting ReactFlow colorMode using next-themes
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setNodes(homeConfig.workflowDemo.nodes);
    setEdges(homeConfig.workflowDemo.edges);
  }, [setNodes, setEdges]);

  const handleOnConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: "var(--primary)",
            },
          },
          edges,
        ),
      );

      if (!connection.targetHandle) return;

      const node = nodes.find((node) => node.id === connection.target);

      if (!node) return;

      const nodeInputs = node.data.inputs;

      delete nodeInputs[connection.targetHandle];

      updateNodeData(node.id, {
        inputs: nodeInputs,
      });
    },
    [setEdges, nodes, updateNodeData],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source === connection.target) {
        if (lastInvalidConnection.current !== "self-loop") {
          toast.warning("Invalid connection: Cannot connect a node to itself");
          lastInvalidConnection.current = "self-loop";
        }
        return false;
      }

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) {
        if (lastInvalidConnection.current !== "node-not-found") {
          toast.error("Invalid connection: Source or target node not found");
          lastInvalidConnection.current = "node-not-found";
        }
        return false;
      }

      const sourceTask = taskRegistry[sourceNode.data.type];
      const targetTask = taskRegistry[targetNode.data.type];

      const output = sourceTask.outputs.find(
        (output) => output.name === connection.sourceHandle,
      );
      const input = targetTask.inputs.find(
        (input) => input.name === connection.targetHandle,
      );

      if (output?.type !== input?.type) {
        if (lastInvalidConnection.current !== "type-mismatch") {
          toast.warning("Invalid connection: Connection type mismatch");
          lastInvalidConnection.current = "type-mismatch";
        }
        return false;
      }

      const hasCycle = (node: WorkflowNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (hasCycle(targetNode)) {
        if (lastInvalidConnection.current !== "cycle-detected") {
          toast.warning("Invalid connection: Cycle detected");
          lastInvalidConnection.current = "cycle-detected";
        }
        return false;
      }

      return true;
    },
    [nodes, edges],
  );

  return (
    <>
      {isMounted ? (
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
          onConnect={handleOnConnect}
          onConnectEnd={() => (lastInvalidConnection.current = null)}
          isValidConnection={isValidConnection}
        >
          <Controls position="top-left" fitViewOptions={fitViewOptions} />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            patternClassName="!fill-muted-foreground"
            className="!bg-background"
          />
        </ReactFlow>
      ) : (
        <Skeleton className="size-full" />
      )}
    </>
  );
}
