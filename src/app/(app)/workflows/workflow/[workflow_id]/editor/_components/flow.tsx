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
  getOutgoers,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Node from "./nodes/node";
import { useTheme } from "next-themes";
import {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import { useLogger } from "next-axiom";
import DeleteableEdge from "./edges/deleteable-edge";
import createWorkflowNode from "@/lib/workflow/helpers/create-workflow-node";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { TaskType } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";
import getWorkflow from "../_data-access/get-workflow";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { calculateTotalCreditCostFromNodes } from "@/lib/utils";

const fitViewOptions = {
  padding: 1,
};

type Props = {
  workflow: Awaited<ReturnType<typeof getWorkflow>>;
};

export default function Flow({ workflow }: Props) {
  const log = useLogger();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { setEditorWorkflowCreditCost, updateEditorWorkflowCreditCost } =
    useWorkflowsStore();
  const nodeTypes = useMemo(() => ({ node: Node }), []);
  const edgeTypes = useMemo(() => ({ default: DeleteableEdge }), []);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  // lastInvalidConnection is used to track the last connection error
  // to prevent displaying more than one toast at a time while
  // the edge is being dragged over that handle.
  const lastInvalidConnection = useRef<string | null>(null);

  useEffect(() => {
    // Required to prevent hydration error when setting ReactFlow colorMode using next-themes
    setIsMounted(true);
  }, []);

  useEffect(() => {
    try {
      const workflowDefinition = JSON.parse(workflow!.definition as string);

      if (!workflowDefinition) throw new Error("Workflow definition missing");

      const nodes = workflowDefinition.nodes as WorkflowNode[];

      setNodes(nodes || []);
      setEdges(workflowDefinition.edges || []);

      setEditorWorkflowCreditCost(
        calculateTotalCreditCostFromNodes(nodes || []),
      );

      if (!workflowDefinition.viewport) return;

      const { x = 0, y = 0, zoom = 1 } = workflowDefinition.viewport;

      setViewport({ x, y, zoom });
    } catch (error) {
      setNodes([]);
      setEdges([]);

      log.error("Error parsing workflow definition", { error });

      toast.error(userErrorMessages.Unexpected);
    } finally {
      log.flush();
    }
  }, [
    workflow,
    setEdges,
    setNodes,
    setViewport,
    log,
    setEditorWorkflowCreditCost,
  ]);

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

      const newNode = createWorkflowNode(taskType as TaskType, poisiton);

      const nodeCreditCost = taskRegistry[newNode.data.type].credits;

      updateEditorWorkflowCreditCost(nodeCreditCost);

      setNodes((prev) => prev.concat(newNode));
    },
    [setNodes, screenToFlowPosition, updateEditorWorkflowCreditCost],
  );

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
      onConnectEnd={() => (lastInvalidConnection.current = null)}
      isValidConnection={isValidConnection}
    >
      <Controls position="top-left" fitViewOptions={fitViewOptions} />
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={1}
        patternClassName="!fill-muted-foreground"
        className="!bg-primary/10 dark:!bg-background"
      />
    </ReactFlow>
  );
}
