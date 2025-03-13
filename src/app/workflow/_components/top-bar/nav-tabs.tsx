"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  workflowId: string;
};

export default function NavTabs({ workflowId }: Props) {
  const pathname = usePathname();
  const activeValue = pathname.split("/")[2];

  return (
    <Tabs value={activeValue} className="w-[300px]">
      <TabsList className="grid w-full grid-cols-2 transition-[height,padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-8 group-has-data-[collapsible=icon]/sidebar-wrapper:py-0">
        <TabsTrigger
          asChild
          value="editor"
          className="transition-[padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:py-0.5"
        >
          <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
        </TabsTrigger>
        <TabsTrigger
          asChild
          value="executions"
          className="transition-[padding] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:py-0.5"
        >
          <Link href={`/workflow/executions/${workflowId}`}>Executions</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
