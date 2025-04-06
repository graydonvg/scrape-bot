import TooltipWrapper from "@/components/tooltip-wrapper";
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
        style={{
          ...props.style,
        }}
        className="!stroke-primary !stroke-2"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <TooltipWrapper tooltipContent="Delete connection">
            <Button
              aria-label="Delete connection"
              variant="outline"
              size="icon"
              className="hover:bg-destructive hover:text-destructive-foreground pointer-events-auto size-6 cursor-pointer rounded-full border text-xs leading-none"
              onClick={() =>
                setEdges((edges) =>
                  edges.filter((edge) => edge.id !== props.id),
                )
              }
            >
              X
            </Button>
          </TooltipWrapper>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
