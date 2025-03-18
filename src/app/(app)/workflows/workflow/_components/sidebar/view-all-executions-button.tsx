import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  workflowId: string;
};

export default function ViewAllExecutionsButton({ workflowId }: Props) {
  return (
    <SidebarMenuItem className="mt-2 px-4">
      <Link href={`/workflows/workflow/executions/${workflowId}`}>
        <SidebarMenuButton variant="outline" className="justify-center">
          <HistoryIcon className="stroke-muted-foreground" />
          View All Executions
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}
