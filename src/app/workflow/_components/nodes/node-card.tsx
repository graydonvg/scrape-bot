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
        "bg-background flex w-md cursor-pointer flex-col rounded-md border-2 text-xs",
        {
          "ring-ring/40 outline-ring ring-4 outline-1 transition-[box-shadow]":
            isSelected,
          // "border-primary": isSelected,
        },
      )}
    >
      {children}
    </div>
  );
}
