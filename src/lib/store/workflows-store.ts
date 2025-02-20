import { create } from "zustand";
import { Workflow } from "../types";

type WorkflowsState = {
  existingWorkflowNames: string[];
  updateExistingWorkflowNames: (workflows: Workflow[]) => void;
};

const useWorkflowsStore = create<WorkflowsState>((set) => ({
  existingWorkflowNames: [],
  updateExistingWorkflowNames: (workflows) =>
    set({ existingWorkflowNames: workflows.map((workflow) => workflow.name) }),
}));

export default useWorkflowsStore;
