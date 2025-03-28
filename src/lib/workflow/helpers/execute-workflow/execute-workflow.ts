import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import { revalidatePath } from "next/cache";
import getUniquePhaseNumbers from "../get-unique-phase-numbers";
import { groupTasksByPhaseNumber } from "../group-tasks";
import { Edge } from "@xyflow/react";
import initializeWorkflowExecution from "./initialize-workflow-execution";
import executeWorkflowPhase from "./execute-workflow-phase";
import finalizeWorkflowExecution from "./finalize-workflow-execution";
import { cleanupPhaseContext } from "./context";
import {
  ExecutionPhaseContext,
  WorkflowExecutionStatusDb,
} from "@/lib/types/execution";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

let log = new Logger();

export default async function executeWorkflow(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  nextExecutionAt?: string,
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
      log.error(loggerErrorMessages.Select, {
        error: selectExecutionDataError,
      });
      // TODO: Handle error
      throw new Error("Workflow execution not found");
    }

    await initializeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      log,
      nextExecutionAt,
    );

    let totalCreditsConsumed = 0;
    let totalCreditsToRefund = 0;
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
    const workflowSuccesses: (boolean | "partial")[] = [];

    for (const phase of phases) {
      const { success, creditsConsumed, creditsToRefund } =
        await executeWorkflowPhase(
          supabase,
          userId,
          phase,
          phaseContext,
          edges,
          log,
        );

      workflowSuccesses.push(success);
      totalCreditsConsumed += creditsConsumed;
      totalCreditsToRefund += creditsToRefund;
    }

    let status: WorkflowExecutionStatusDb = "COMPLETED";
    const workflowIsCompleted = workflowSuccesses.every(
      (success) => success === true,
    );
    const workflowFailed = workflowSuccesses.every(
      (success) => success === false,
    );

    if (!workflowIsCompleted && !workflowFailed) status = "PARTIALLY_FAILED";
    if (workflowFailed) status = "FAILED";

    await finalizeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      status,
      totalCreditsConsumed,
      totalCreditsToRefund,
      log,
    );

    await cleanupPhaseContext(phaseContext, log);

    revalidatePath(`/workflows`);
  } catch (error) {
    // TODO: Handle error
    log.error(loggerErrorMessages.Unexpected, { error });
    throw error;
  }
}
