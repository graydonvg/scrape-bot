import { WorkflowTaskType, Workflow } from "@/lib/types";
import { createWorkflowNode } from "@/lib/utils";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ColorMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Node from "./nodes/node";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

const fitViewOptions = {
  padding: 1,
};

type Props = {
  workflow: Partial<Workflow>;
};

export default function Flow({ workflow }: Props) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const nodeTypes = useMemo(() => ({ node: Node }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    createWorkflowNode(WorkflowTaskType.LaunchBrowser),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Required to prevent hydration error when setting ReactFlow colorMode using next-themes
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      colorMode={`${theme}` as ColorMode}
      fitView
      fitViewOptions={fitViewOptions}
    >
      <Controls position="top-left" fitViewOptions={fitViewOptions} />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
