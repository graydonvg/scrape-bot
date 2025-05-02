import { loggerErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { SortingState } from "@tanstack/react-table";

type Params = {
  workflowId: string;
  pagination: {
    rows: number;
    page: number;
  };
  sorting: SortingState;
};

export default async function getAllWorkflowExecutionsClient({
  workflowId,
  pagination,
  sorting,
}: Params) {
  let log = new Logger().with({
    context: "getAllWorkflowExecutions",
    workflowId,
  });

  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(loggerErrorMessages.Unauthorized);
      return null;
    }

    log = log.with({ userId: user.id });

    const query = supabase
      .from("workflowExecutions")
      .select("*, tasks(taskId), ...workflows!inner(workflowName:name)", {
        count: "exact",
      })
      .eq("userId", user.id)
      .eq("workflowId", workflowId);

    sorting.forEach((sort) => query.order(sort.id, { ascending: !sort.desc }));

    const from = pagination.page * pagination.rows;
    const to = from + pagination.rows - 1;

    const {
      data: workflowExecutions,
      count,
      error,
    } = await query
      .order("phase", { ascending: true, referencedTable: "tasks" })
      .limit(1, { foreignTable: "tasks" })
      .range(from, to);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return { workflowExecutions, count };
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
