import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  WorkflowExecutionStatusDb,
  WorkflowNodeInvalidInputs,
} from "../types/execution";

type WorkflowsState = {
  existingWorkflowNames: string[];
  setExistingWorkflowNames: (workflowNames: string[]) => void;
  invalidInputs: WorkflowNodeInvalidInputs[] | null;
  setInvalidInputs: (invalidInputs: WorkflowNodeInvalidInputs[]) => void;
  clearErrors: () => void;
  workflowExecutionStatus: WorkflowExecutionStatusDb | null;
  setWorkflowExecutionStatus: (
    workflowExecutionStatus: WorkflowExecutionStatusDb | null,
  ) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (selectedTaskId: string | null) => void;
  editorWorkflowCreditCost: number;
  setEditorWorkflowCreditCost: (credits: number) => void;
  updateEditorWorkflowCreditCost: (credits: number) => void;
};

const useWorkflowsStore = create<WorkflowsState>()(
  persist(
    (set) => ({
      existingWorkflowNames: [],
      setExistingWorkflowNames: (workflowNames) =>
        set({ existingWorkflowNames: workflowNames }),
      invalidInputs: null,
      setInvalidInputs: (invalidInputs) => set({ invalidInputs }),
      clearErrors: () => set({ invalidInputs: null }),
      workflowExecutionStatus: null,
      setWorkflowExecutionStatus: (workflowExecutionStatus) =>
        set({ workflowExecutionStatus }),
      selectedTaskId: null,
      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
      editorWorkflowCreditCost: 0,
      setEditorWorkflowCreditCost: (credits) =>
        set({
          editorWorkflowCreditCost: credits,
        }),
      updateEditorWorkflowCreditCost: (credits) =>
        set((state) => ({
          editorWorkflowCreditCost: state.editorWorkflowCreditCost + credits,
        })),
    }),
    {
      name: "workflows-storage", // Storage key
      partialize: (state) => ({ selectedTaskId: state.selectedTaskId }), // Persist only selectedTaskId
    },
  ),
);

export default useWorkflowsStore;
