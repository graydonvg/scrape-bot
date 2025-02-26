import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";

export default function DeleteableEdge(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
        type=""
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="pointer-events-auto size-5 cursor-pointer rounded-full border text-xs leading-none hover:shadow-lg"
            onClick={() =>
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
            }
          >
            X
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
