import { Workflow } from "@/lib/types";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ColorMode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Node from "./nodes/node";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import { useLogger } from "next-axiom";

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
  const { setViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

  if (!isMounted) return null;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      colorMode={`${theme}` as ColorMode}
      fitViewOptions={fitViewOptions}
      fitView
    >
      <Controls position="top-left" fitViewOptions={fitViewOptions} />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
