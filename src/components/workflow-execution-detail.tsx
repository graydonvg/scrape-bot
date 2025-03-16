import TooltipWrapper from "@/components/tooltip-wrapper";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
};

export default function WorkflowExecutionDetail({ icon, label, value }: Props) {
  const Icon = icon;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if the value is overflowing to enable tooltip
    // to show the full value
    function checkOverflow() {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollHeight > textRef.current.clientHeight,
        );
      }
    }

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <SidebarMenuItem>
      <div className="ring-sidebar-ring flex w-full items-center justify-between px-4 py-2 text-left text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Icon size={20} className="stroke-muted-foreground/80" />
          <span>{label}</span>
        </div>
        <TooltipWrapper hidden={!isOverflowing} tooltipContent={value}>
          <span ref={textRef} className="line-clamp-2 max-w-1/2 font-semibold">
            {value}
          </span>
        </TooltipWrapper>
      </div>
    </SidebarMenuItem>
  );
}
