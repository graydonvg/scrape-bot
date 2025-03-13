"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleDashedIcon, ClockIcon, CoinsIcon } from "lucide-react";
import { cn, datesToDurationString } from "@/lib/utils";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { WorkflowNode } from "@/lib/types/workflow";
import { TaskParamType } from "@/lib/types/task";
import TaskLogs from "./task-logs";
import TaskBadge from "./task-badge";
import getWorkflowExecutionWithTasksClient from "@/app/workflow/execution/[workflow_id]/[execution_id]/_data-access/get-execution-with-tasks-client";
import getTaskDetails from "@/app/workflow/execution/[workflow_id]/[execution_id]/_data-access/get-task-details";
import TopBar from "@/app/workflow/_components/top-bar/top-bar";
import TaskParameterCard from "./task-parameter-card/task-parameter-card";
import TaskDetailsSkeleton from "./task-details-skeleton";
import ExecutionStatusMessage from "./execution-status-message";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getWorkflowExecutionWithTasksClient>>;
};

export default function ExecutionDetails({ workflowId, initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get("task");
  const { setWorkflowExecutionData } = useWorkflowsStore();
  const [workflowDidExecute, setWorkflowDidExecute] = useState(false);
  const workflowExecutionId = initialData!.workflowExecutionId;

  const executionQuery = useQuery({
    queryKey: ["execution", workflowExecutionId],
    initialData,
    queryFn: () => getWorkflowExecutionWithTasksClient(workflowExecutionId),
    refetchInterval: (query) =>
      query.state.data?.status === "EXECUTING" ? 1000 : false,
  });

  const taskQuery = useQuery({
    queryKey: ["taskDetails", taskIdParam],
    enabled: taskIdParam !== null,
    queryFn: () => getTaskDetails(taskIdParam!),
  });
  const workflowExecutionData = executionQuery.data;
  const taskData = taskQuery.data;

  const workflowExecutionStatus = getWorkflowExecutionStatus();
  const inputIncludesBrowserInstance =
    checkParamIncludesBrowserInstance("inputs");
  const outputIncludesBrowserInstance =
    checkParamIncludesBrowserInstance("outputs");
  const launchBrowserTaskStatus = getLaunchBrowserTaskStatus();

  useEffect(() => {
    if (workflowExecutionData) setWorkflowExecutionData(workflowExecutionData);
  }, [workflowExecutionData, setWorkflowExecutionData]);

  useEffect(() => {
    if (!workflowExecutionData) return;

    // Check if the workflow did execute to prevent forcefully
    // navigating the user to a specific task on refresh
    if (workflowExecutionData.status === "EXECUTING")
      setWorkflowDidExecute(true);
  }, [workflowExecutionData]);

  useEffect(() => {
    if (!workflowExecutionData || !workflowDidExecute) return;
    // Tasks are ordered by phase and completedAt in the query.

    // If the entire workflow completed, select the last task that complete.
    if (workflowExecutionStatus.isCompleted && !taskIdParam) {
      setWorkflowDidExecute(false);

      const taskToSelect = workflowExecutionData.tasks.at(-1);

      router.replace(`?task=${taskToSelect!.taskId}`);
    }

    // If the entire worklfow failed, select the first task that failed.
    if (workflowExecutionStatus.isFailed && !taskIdParam) {
      setWorkflowDidExecute(false);

      const taskToSelect = workflowExecutionData.tasks.find(
        (task) => task.status === "FAILED",
      );

      router.replace(`?task=${taskToSelect!.taskId}`);
    }

    // If the worklfow partially failed, select the last task that complete.
    if (workflowExecutionStatus.isPartiallyFailed && !taskIdParam) {
      setWorkflowDidExecute(false);

      const taskToSelect = workflowExecutionData.tasks.findLast(
        (task) => task.status === "COMPLETED",
      );

      router.replace(`?task=${taskToSelect!.taskId}`);
    }
  }, [
    workflowExecutionData,
    workflowExecutionStatus,
    taskIdParam,
    router,
    workflowDidExecute,
  ]);

  return (
    <>
      <TopBar
        workflowId={workflowId}
        title="Workflow execution"
        subtitle={`Execution ID: ${workflowExecutionId}`}
        hideActionButtons
      />
      <section className="size-full">
        {workflowExecutionStatus.isLoading && (
          <ExecutionStatusMessage
            title="Execution in progress"
            message="Please wait..."
          />
        )}
        {!workflowExecutionStatus.isLoading && !taskIdParam && (
          <ExecutionStatusMessage
            title="Execution completed"
            message="Fetching task details..."
          />
        )}
        {taskIdParam && taskQuery.isLoading && <TaskDetailsSkeleton />}
        {!taskQuery.isLoading && taskData && (
          <div className="container flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <TaskBadge
                icon={CircleDashedIcon}
                label="Status"
                value={
                  <span
                    className={cn("text-success dark:text-green-500", {
                      "text-destructive dark:text-destructive":
                        taskData.status === "FAILED",
                    })}
                  >
                    {taskData.status}
                  </span>
                }
              />
              <TaskBadge
                icon={CoinsIcon}
                label="Credits"
                value={taskData.creditsConsumed}
              />
              <TaskBadge
                icon={ClockIcon}
                label="Duration"
                value={
                  <span>
                    {datesToDurationString(
                      taskData.startedAt ? new Date(taskData.startedAt) : null,
                      taskData.completedAt
                        ? new Date(taskData.completedAt)
                        : null,
                    ) || "-"}
                  </span>
                }
              />
            </div>
            <TaskParameterCard
              title="Inputs"
              subtitle="Inputs received for this task"
              fallbackText="No inputs received for this task"
              paramsJson={taskData.inputs}
              includesBrowserInstance={
                inputIncludesBrowserInstance &&
                // If the launchBrowserTask was successful,
                // the browser instance will be an input
                launchBrowserTaskStatus !== "FAILED"
              }
            />
            <TaskParameterCard
              title="Outputs"
              subtitle="Outputs generated by this task"
              fallbackText="No outputs generated by this task"
              paramsJson={taskData.outputs}
              includesBrowserInstance={
                outputIncludesBrowserInstance &&
                // If the launchBrowserTask was successful,
                // the browser instance will be a output
                launchBrowserTaskStatus !== "FAILED"
              }
            />
            <TaskLogs logs={taskData.taskLogs} />
          </div>
        )}
      </section>
    </>
  );

  function getLaunchBrowserTaskStatus() {
    const launchBrowserTask = workflowExecutionData?.tasks.find((task) => {
      const node = JSON.parse(task.node as string) as WorkflowNode;
      return task.name === taskRegistry[node.data.type].label;
    });

    return launchBrowserTask?.status;
  }

  function checkParamIncludesBrowserInstance(param: "inputs" | "outputs") {
    const taskNode = taskData
      ? (JSON.parse(taskData.node as string) as WorkflowNode)
      : null;

    return taskNode
      ? taskRegistry[taskNode.data.type][param].some(
          (input) => input.type === TaskParamType.BrowserInstance,
        )
      : false;
  }

  function getWorkflowExecutionStatus() {
    const isPending = workflowExecutionData?.status === "PENDING";
    const isExecuting = workflowExecutionData?.status === "EXECUTING";
    const isCompleted = workflowExecutionData?.status === "COMPLETED";
    const isFailed = workflowExecutionData?.status === "FAILED";
    const isPartiallyFailed =
      workflowExecutionData?.status === "PARTIALLY_FAILED";
    const isLoading = isPending || isExecuting;

    return {
      isLoading,
      isPending,
      isExecuting,
      isCompleted,
      isFailed,
      isPartiallyFailed,
    };
  }
}
