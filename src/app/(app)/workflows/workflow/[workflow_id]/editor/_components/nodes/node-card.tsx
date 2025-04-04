import useWorkflowsStore from "@/lib/store/workflows-store";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

type Props = {
  nodeId: string;
  isSelected: boolean;
  children: ReactNode;
};

export default function NodeCard({ nodeId, isSelected, children }: Props) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useWorkflowsStore();
  const hasInvalidInput = invalidInputs?.some(
    (invalidInput) => invalidInput.nodeId === nodeId,
  );

  function handleDoubleClick() {
    const node = getNode(nodeId);

    if (!node) return;

    const { position, measured } = node;

    if (!position || !measured) return;

    const { width, height } = measured;

    if (!width || !height) return;

    const nodeX = position.x + width / 2;
    const nodeY = position.y + height / 2;

    setCenter(nodeX, nodeY, { zoom: 1, duration: 500 });
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        "bg-muted dark:border-border border-foreground/30 flex w-md cursor-pointer flex-col rounded-xl border-2 text-xs",
        {
          "ring-ring/40 border-ring ring-4 transition-[border,box-shadow] outline-none":
            isSelected,
          "ring-destructive/40 border-destructive ring-4 transition-[border,box-shadow] outline-none":
            hasInvalidInput,
        },
      )}
    >
      {children}
    </div>
  );
}
