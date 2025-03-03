"use client";

import { useQuery } from "@tanstack/react-query";
import TopBar from "../../_components/top-bar";
import getWorkflowExecutionWithPhases from "../_data-access/get-execution-with-phases-server";
import { useEffect } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import getWorkflowExecutionWithPhasesClient from "../_data-access/get-execution-with-phases-client";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;
};

export default function ExecutionViewer({ workflowId, initialData }: Props) {
  const workflowExecutionId = initialData!.workflowExecutionId;
  const query = useQuery({
    queryKey: ["execution", workflowExecutionId],
    initialData,
    queryFn: () => getWorkflowExecutionWithPhasesClient(workflowExecutionId),
    refetchInterval: (query) =>
      query.state.data?.status === "EXECUTING" ? 1000 : false,
  });
  const { setWorkflowExecutionData } = useWorkflowsStore();

  useEffect(() => {
    const workflowExecutionData = query.data;

    if (workflowExecutionData) setWorkflowExecutionData(workflowExecutionData);
  }, [query.data, setWorkflowExecutionData]);

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <TopBar
        workflowId={workflowId}
        title="Workflow execution"
        subtitle={`Execution ID: ${workflowExecutionId}`}
        hideButtons
      />
      <section className="flex grow">
        <div>Wrapper for ID:{workflowExecutionId}</div>
      </section>
    </div>
  );
}
