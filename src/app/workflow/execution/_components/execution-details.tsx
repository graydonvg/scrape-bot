"use client";

import { useQuery } from "@tanstack/react-query";
import TopBar from "../../_components/top-bar";
import getWorkflowExecutionWithPhases from "../_data-access/get-execution-with-tasks-server";
import { useEffect, useState } from "react";
import useWorkflowsStore from "@/lib/store/workflows-store";
import getWorkflowExecutionWithTasksClient from "../_data-access/get-execution-with-tasks-client";
import { useRouter, useSearchParams } from "next/navigation";
import getTaskDetails from "../_data-access/get-task-details";
import { CircleDashedIcon, ClockIcon, CoinsIcon } from "lucide-react";
import { cn, datesToDurationString } from "@/lib/utils";
import TaskParameterCard from "./task-parameter-card/task-parameter-card";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { WorkflowNode } from "@/lib/types/workflow";
import { TaskParamType } from "@/lib/types/task";
import TaskLogs from "./task-logs";
import TaskBadge from "./task-badge";

type Props = {
  workflowId: string;
  initialData: Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;
};

export default function ExecutionDetails({ workflowId, initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get("task");
  const { setWorkflowExecutionData } = useWorkflowsStore();
  const [workflowDidExecute, setWorkflowDidExecute] = useState(false);
  const workflowExecutionId = initialData!.workflowExecutionId;

  const executionDetails = useQuery({
    queryKey: ["execution", workflowExecutionId],
    initialData,
    queryFn: () => getWorkflowExecutionWithTasksClient(workflowExecutionId),
    refetchInterval: (query) =>
      query.state.data?.status === "EXECUTING" ? 1000 : false,
  });

  const taskDetails = useQuery({
    queryKey: ["taskDetails", taskIdParam],
    enabled: taskIdParam !== null,
    queryFn: () => getTaskDetails(taskIdParam!),
  });
  const workflowExecutionData = executionDetails.data;
  const taskData = taskDetails.data;

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
    <div className="flex size-full flex-col">
      <TopBar
        workflowId={workflowId}
        title="Workflow execution"
        subtitle={`Execution ID: ${workflowExecutionId}`}
        hideButtons
      />
      <section className="flex grow">
        {workflowExecutionStatus.isLoading && (
          <div className="flex-center size-full flex-col gap-2">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-3xl font-bold">Execution in progress</p>
              <p className="text-muted-foreground text-xl">Please wait...</p>
            </div>
          </div>
        )}
        {!workflowExecutionStatus.isLoading && !taskIdParam && (
          <div className="flex-center size-full flex-col gap-2">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-3xl font-bold">Execution completed</p>
              <p className="text-muted-foreground text-xl">
                Select a task to view details
              </p>
            </div>
          </div>
        )}
        {taskData && (
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
