import { create } from "zustand";
import { Database } from "../supabase/database.types";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (
    workflows: Database["public"]["Tables"]["workflows"]["Row"][],
  ) => void;
};

const useWorkflowsStore = create<WorkflowsState>((set) => ({
  existingWorkflowNames: [],
  setExistingWorkflowNames: (workflows) =>
    set({ existingWorkflowNames: workflows.map((workflow) => workflow.name) }),
}));

export default useWorkflowsStore;
