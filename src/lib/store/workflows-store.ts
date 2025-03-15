import { create } from "zustand";
import getWorkflowExecutionWithTasksClient from "@/app/(app)/workflows/workflow/execution/[workflow_id]/[execution_id]/_data-access/get-execution-with-tasks-client";
import { WorkflowNodeInvalidInputs } from "../types/execution";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (workflowNames: string[]) => void;
  invalidInputs: WorkflowNodeInvalidInputs[] | null;
  setInvalidInputs: (invalidInputs: WorkflowNodeInvalidInputs[]) => void;
  clearErrors: () => void;
  workflowExecutionData: Awaited<
    ReturnType<typeof getWorkflowExecutionWithTasksClient>
  > | null;
  setWorkflowExecutionData: (
    workflowExecutionData: Awaited<
      ReturnType<typeof getWorkflowExecutionWithTasksClient>
    > | null,
  ) => void;
};

const useWorkflowsStore = create<WorkflowsState>((set) => ({
  existingWorkflowNames: [],
  setExistingWorkflowNames: (workflowNames) =>
    set({ existingWorkflowNames: workflowNames }),
  invalidInputs: null,
  setInvalidInputs: (invalidInputs) => set({ invalidInputs }),
  clearErrors: () => set({ invalidInputs: null }),
  workflowExecutionData: null,
  setWorkflowExecutionData: (workflowExecutionData) =>
    set({ workflowExecutionData: workflowExecutionData }),
}));

export default useWorkflowsStore;
