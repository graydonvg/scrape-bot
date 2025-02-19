"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import { Database } from "@/lib/supabase/database.types";
import { useEffect } from "react";

type Props = {
  workflows: Database["public"]["Tables"]["workflows"]["Row"][];
};

export default function WorkflowsStoreInitializer({ workflows }: Props) {
  const { setExistingWorkflowNames } = useWorkflowsStore();

  useEffect(() => {
    setExistingWorkflowNames(workflows);
  }, [workflows, setExistingWorkflowNames]);

  return null;
}
