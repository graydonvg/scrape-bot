"use client";

import { useQuery } from "@tanstack/react-query";
import TopBar from "../../_components/top-bar";
import getWorkflowExecutionWithPhases from "../_data-access/get-execution-with-tasks-server";
import { useEffect } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import getWorkflowExecutionWithTasksClient from "../_data-access/get-execution-with-tasks-client";
import { useSearchParams } from "next/navigation";
import getTaskDetails from "../_data-access/get-task-details";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;
};

export default function ExecutionViewer({ workflowId, initialData }: Props) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");
  const { setWorkflowExecutionData } = useWorkflowsStore();
  const workflowExecutionId = initialData!.workflowExecutionId;
  const executionData = useQuery({
    queryKey: ["execution", workflowExecutionId],
    initialData,
    queryFn: () => getWorkflowExecutionWithTasksClient(workflowExecutionId),
    refetchInterval: (query) =>
      query.state.data?.status === "EXECUTING" ? 1000 : false,
  });
  const taskDetails = useQuery({
    queryKey: ["taskDetails", taskId],
    enabled: taskId !== null,
    queryFn: () => getTaskDetails(taskId!),
  });

  useEffect(() => {
    const workflowExecutionData = executionData.data;

    if (workflowExecutionData) setWorkflowExecutionData(workflowExecutionData);
  }, [executionData.data, setWorkflowExecutionData]);

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <TopBar
        workflowId={workflowId}
        title="Workflow execution"
        subtitle={`Execution ID: ${workflowExecutionId}`}
        hideButtons
      />
      <section className="flex grow">
        <pre>{JSON.stringify(taskDetails.data, null, 2)}</pre>
      </section>
    </div>
  );
}
