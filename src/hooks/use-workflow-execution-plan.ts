"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import {
  WorkflowExecutionPlanError,
  WorkflowExecutionPlanErrorType,
} from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";
import buildWorkflowExecutionPlan from "@/lib/workflow/helpers/build-workflow-execution-plan";
import { useReactFlow } from "@xyflow/react";
import { useLogger } from "next-axiom";
import { useCallback } from "react";
import { toast } from "sonner";

export default function useWorkflowExecutionPlan() {
  const log = useLogger().with({ context: "useWorkflowExecutionPlan" });
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useWorkflowsStore();

  const handleError = useCallback(
    (error: WorkflowExecutionPlanError) => {
      switch (error.type) {
        case WorkflowExecutionPlanErrorType.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case WorkflowExecutionPlanErrorType.INVALID_INPUTS:
          if (error.invalidInputs && error.invalidInputs.length > 0) {
            setInvalidInputs(error.invalidInputs);
          }
          toast.error("Missing required inputs. Please check and try again.");
          break;
        default:
          log.error(
            "An unexpected error occured while building workflow execution plan",
            { error },
          );
          toast.error("An unexpected error occured");
          break;
      }
    },
    [setInvalidInputs, log],
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionPlan, error } = buildWorkflowExecutionPlan(
      nodes as WorkflowNode[],
      edges,
    );

    if (error) {
      handleError(error);

      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
}
