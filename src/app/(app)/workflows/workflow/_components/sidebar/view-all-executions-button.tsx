import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  workflowId: string;
  disabled: boolean;
};

export default function ViewAllExecutionsButton({
  workflowId,
  disabled,
}: Props) {
  return (
    <SidebarMenuItem className="mt-2 px-4">
      <SidebarMenuButton variant="outline" className="justify-center" asChild>
        <Link
          aria-disabled={disabled}
          href={`/workflows/workflow/executions/${workflowId}`}
        >
          <HistoryIcon className="stroke-muted-foreground" />
          View All Executions
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
