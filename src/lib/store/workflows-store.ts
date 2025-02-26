import { create } from "zustand";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (workflowNames: string[]) => void;
};

const useWorkflowsStore = create<WorkflowsState>((set) => ({
  existingWorkflowNames: [],
  setExistingWorkflowNames: (workflowNames) =>
    set({ existingWorkflowNames: workflowNames }),
}));

export default useWorkflowsStore;
