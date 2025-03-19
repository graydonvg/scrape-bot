import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  workflowId: string;
  disabled?: boolean;
};

export default function ViewAllExecutionsButton({
  workflowId,
  disabled,
}: Props) {
  return (
    <SidebarMenuItem className="mt-2 px-2">
      <SidebarMenuButton
        variant="outline"
        // Shadow colors are the same as --muted-foreground
        className="bg-sidebar justify-center shadow-[0_0_0_1px_hsla(240,5.2%,33.9%,60%)] hover:shadow-[0_0_0_1px_hsla(240,5.2%,33.9%,80%)] dark:shadow-[0_0_0_1px_hsla(240,5%,64.9%,60%)] dark:hover:shadow-[0_0_0_1px_hsla(240,5%,64.9%,80%)]"
        asChild
      >
        <Link
          aria-disabled={disabled}
          href={`/workflows/workflow/${workflowId}/executions`}
        >
          <HistoryIcon className="stroke-muted-foreground" />
          View All Executions
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
