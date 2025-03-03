import { create } from "zustand";
import { WorkflowNodeInvalidInputs } from "../types";
import getWorkflowExecutionWithPhasesClient from "@/app/workflow/execution/_data-access/get-execution-with-phases-client";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (workflowNames: string[]) => void;
  invalidInputs: WorkflowNodeInvalidInputs[] | null;
  setInvalidInputs: (invalidInputs: WorkflowNodeInvalidInputs[]) => void;
  clearErrors: () => void;
  workflowExecutionData: Awaited<
    ReturnType<typeof getWorkflowExecutionWithPhasesClient>
  > | null;
  setWorkflowExecutionData: (
    workflowExecutionData: Awaited<
      ReturnType<typeof getWorkflowExecutionWithPhasesClient>
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
