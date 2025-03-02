import { create } from "zustand";
import { WorkflowNodeInvalidInputs } from "../types";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (workflowNames: string[]) => void;
  invalidInputs: WorkflowNodeInvalidInputs[] | null;
  setInvalidInputs: (invalidInputs: WorkflowNodeInvalidInputs[]) => void;
  clearErrors: () => void;
};

const useWorkflowsStore = create<WorkflowsState>((set) => ({
  existingWorkflowNames: [],
  invalidInputs: null,
  setExistingWorkflowNames: (workflowNames) =>
    set({ existingWorkflowNames: workflowNames }),
  setInvalidInputs: (invalidInputs) => set({ invalidInputs }),
  clearErrors: () => set({ invalidInputs: null }),
}));

export default useWorkflowsStore;
