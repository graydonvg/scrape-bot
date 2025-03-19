import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { Logger } from "next-axiom";
import { revalidatePath } from "next/cache";
import getUniquePhaseNumbers from "../get-unique-phase-numbers";
import { groupTasksByPhaseNumber } from "../group-tasks";
import { Edge } from "@xyflow/react";
import initializeWorkflowExecution from "./initialize-workflow-execution";
import executeWorkflowPhase from "./execute-workflow-phase";
import finalizeWorkflowExecution from "./finalize-workflow-execution";
import { cleanupPhaseContext } from "./context";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import {
  ExecutionPhaseContext,
  WorkflowExecutionStatusDb,
} from "@/lib/types/execution";

let log = new Logger();

export default async function executeWorkflow(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
) {
  log = log.with({
    context: "executeWorkflow",
    userId,
    workflowId,
    executionId,
  });

  try {
    const { data: workflowExecutionData, error: selectExecutionDataError } =
      await supabase
        .from("workflowExecutions")
        .select("definition, tasks(*)")
        .eq("userId", userId)
        .eq("workflowExecutionId", executionId);

    if (selectExecutionDataError || workflowExecutionData.length === 0) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error: selectExecutionDataError,
      });
      // TODO: Handle error
      throw new Error("Worklfow execution not found");
    }

    await initializeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      log,
    );

    let totalCreditsConsumed = 0;
    let status: WorkflowExecutionStatusDb = "COMPLETED";
    const workflowDefinition = workflowExecutionData[0].definition;
    const edges = JSON.parse(workflowDefinition as string).edges as Edge[];
    const tasks = workflowExecutionData[0].tasks;
    const uniquePhaseNumbers = getUniquePhaseNumbers(tasks);
    const phases = groupTasksByPhaseNumber(uniquePhaseNumbers, tasks);
    /*
 		 * The phaseContext must be declared and initialized here:
 		 * - To retain the browser and page instances needed in subsequent phases.
     		 If phaseContext is declared and initialized elsewhere (e.g., in executeWorkflowPhase),
     		 it will be recreated for each phase, causing the browser and page instances
     		 set in phase 1 to be lost.
 		 * - To call the cleanup function once execution completes.
 		 */
    const phaseContext: ExecutionPhaseContext = { tasks: {} };

    for (const phase of phases) {
      const { success, creditsConsumed } = await executeWorkflowPhase(
        supabase,
        userId,
        phase,
        phaseContext,
        edges,
        log,
      );

      totalCreditsConsumed += creditsConsumed;

      if (success === false) {
        status = "FAILED";
      }

      if (success === "partial") {
        status = "PARTIALLY_FAILED";
      }
    }

    await finalizeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      status,
      totalCreditsConsumed,
      log,
    );

    await cleanupPhaseContext(phaseContext, log);

    revalidatePath(`/workflows/workflow/${workflowId}/execution`);
  } catch (error) {
    // TODO: Handle error
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    throw error;
  }
}
