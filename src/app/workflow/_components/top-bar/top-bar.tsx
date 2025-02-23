import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import SaveWorkflowButton from "./save-workflow-button";

type Props = {
  title: string;
  subtitle?: string;
  workflowId: number;
};

export default function TopBar({ title, subtitle, workflowId }: Props) {
  return (
    <header className="bg-background z-50 flex h-16 items-center justify-between border-b-2 px-2">
      <div className="flex grow basis-2/4 items-center gap-4 truncate">
        <TooltipWrapper tooltipContent="Back">
          <Link href="/workflows">
            <Button variant="ghost" size="icon">
              <ChevronLeftIcon size={20} />
            </Button>
          </Link>
        </TooltipWrapper>
        <div>
          <p className="font-bold">{title}</p>
          {subtitle && (
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex grow justify-end gap-1">
        <SaveWorkflowButton workflowId={workflowId} />
      </div>
    </header>
  );
}
