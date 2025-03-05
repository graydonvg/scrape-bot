import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import SaveWorkflowButton from "../editor/_components/buttons/save-workflow-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeMenu } from "@/components/theme/theme-menu";
import ExecuteWorkflowButton from "../editor/_components/buttons/execute-workflow-button";

type Props = {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
};

export default function TopBar({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
}: Props) {
  return (
    <header className="bg-sidebar flex h-16 shrink-0 items-center border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="bg-sidebar-border mr-2 !h-4"
          />
          <div className="flex w-10 grow items-center gap-4">
            <TooltipWrapper tooltipContent="Back">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-8"
                asChild
              >
                <Link href="/workflows">
                  <ChevronLeftIcon className="size-6 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-4" />
                </Link>
              </Button>
            </TooltipWrapper>

            <div className="flex flex-col justify-center overflow-hidden">
              <p className="truncate font-bold transition-[font-size] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:text-xs">
                {title}
              </p>
              {subtitle && (
                <p className="text-muted-foreground truncate text-xs">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {!hideButtons && (
              <>
                <ExecuteWorkflowButton workflowId={workflowId} />
                <SaveWorkflowButton workflowId={workflowId} />
              </>
            )}
            <ThemeMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
