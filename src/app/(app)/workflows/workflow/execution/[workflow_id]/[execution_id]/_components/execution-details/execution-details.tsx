"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { CircleDashedIcon, ClockIcon, CoinsIcon } from "lucide-react";
import { cn, datesToDurationString } from "@/lib/utils";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { WorkflowNode } from "@/lib/types/workflow";
import { TaskParamType } from "@/lib/types/task";
import TaskLogs from "./task-logs";
import TaskBadge from "./task-badge";
import getWorkflowExecutionWithTasksClient from "@/app/(app)/workflows/workflow/execution/[workflow_id]/[execution_id]/_data-access/get-execution-with-tasks-client";
import getTaskDetails from "@/app/(app)/workflows/workflow/execution/[workflow_id]/[execution_id]/_data-access/get-task-details";
import TaskParameterCard from "./task-parameter-card/task-parameter-card";
import TaskDetailsSkeleton from "./task-details-skeleton";
import ExecutionStatusMessage from "./execution-status-message";
import WorkflowExecutionSidebar from "../sidebar/workflow-execution-sidebar";
import PageHeader from "@/components/page-header";
import { notFound } from "next/navigation";

type Props = {
  initialData: Awaited<ReturnType<typeof getWorkflowExecutionWithTasksClient>>;
};

export default function ExecutionDetails({ initialData }: Props) {
  const { selectedTaskId, setSelectedTaskId, setWorkflowExecutionStatus } =
    useWorkflowsStore();
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
    queryKey: ["taskDetails", selectedTaskId],
    enabled: selectedTaskId !== null,
    queryFn: () => getTaskDetails(selectedTaskId!),
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
    if (workflowExecutionData)
      // Used to enable refetch interval to update available credits during execution.
      setWorkflowExecutionStatus(workflowExecutionData.status);
  }, [workflowExecutionData, setWorkflowExecutionStatus]);

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
    if (workflowExecutionStatus.isCompleted && !selectedTaskId) {
      setWorkflowDidExecute(false);

      const taskToSelect = workflowExecutionData.tasks.at(-1);

      setSelectedTaskId(taskToSelect!.taskId);
    }

    // If a task failed, select the first task that failed.
    if (
      (workflowExecutionStatus.isFailed ||
        workflowExecutionStatus.isPartiallyFailed) &&
      !selectedTaskId
    ) {
      setWorkflowDidExecute(false);

      const taskToSelect = workflowExecutionData.tasks.find(
        (task) => task.status === "FAILED",
      );

      setSelectedTaskId(taskToSelect!.taskId);
    }
  }, [
    workflowExecutionData,
    workflowExecutionStatus,
    selectedTaskId,
    workflowDidExecute,
    setSelectedTaskId,
  ]);

  if (!workflowExecutionData) notFound();

  return (
    <div className="fixed inset-0 top-12 left-[300px] flex grow md:left-[368px]">
      <WorkflowExecutionSidebar workflowExecutionData={workflowExecutionData} />
      <div className="size-full">
        {workflowExecutionStatus.isLoading && (
          <ExecutionStatusMessage
            title="Execution in progress"
            message="Please wait..."
          />
        )}
        {!workflowExecutionStatus.isLoading && !selectedTaskId && (
          <ExecutionStatusMessage
            title="Execution completed"
            message="Select a task to view details"
          />
        )}
        {selectedTaskId && taskQuery.isLoading && <TaskDetailsSkeleton />}
        {!taskQuery.isLoading && taskData && (
          <div className="container flex flex-col gap-4">
            <PageHeader
              title={taskData.name}
              subtitle="Task details"
              containerClassName="mb-6 "
            />
            <div className="flex flex-wrap items-center gap-2">
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
      </div>
    </div>
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
