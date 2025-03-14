import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import BackButton from "./back-button";
import ActionButtons from "./action-buttons";

type Props = {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideSidebarTrigger?: boolean;
  hideActionButtons?: boolean;
};

export default function TopBar({
  title,
  subtitle,
  workflowId,
  hideSidebarTrigger = false,
  hideActionButtons = false,
}: Props) {
  return (
    <>
      <header className="bg-sidebar flex h-16 shrink-0 items-center gap-8 px-4 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex h-full flex-1 items-center gap-2">
          {!hideSidebarTrigger && (
            <>
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="bg-sidebar-border ml-2 !h-[25%]"
              />
            </>
          )}
          <div className="mr-4 flex w-1 flex-1 items-center gap-4">
            <BackButton />
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
        </div>
        <div className="flex h-full flex-1 items-center justify-end gap-2">
          {!hideActionButtons && <ActionButtons workflowId={workflowId} />}
        </div>
      </header>
      <Separator />
    </>
  );
}
