import { loggerErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { SortingState } from "@tanstack/react-table";

type Params = {
  pagination: {
    rows: number;
    page: number;
  };
  sorting: SortingState;
};

export default async function getUserPurchaseHistoryClient({
  pagination,
  sorting,
}: Params) {
  let log = new Logger().with({ context: "getUserPurchaseHistoryClient" });

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
      .from("userPurchases")
      .select("*", { count: "exact" })
      .eq("userId", user.id);

    sorting.forEach((sort) => query.order(sort.id, { ascending: !sort.desc }));

    const from = pagination.page * pagination.rows;
    const to = from + pagination.rows - 1;

    const { data, count, error } = await query.range(from, to);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return { data, count };
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
