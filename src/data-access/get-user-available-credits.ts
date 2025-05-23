import { loggerErrorMessages } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Logger } from "next-axiom";

export default async function getUserAvailableCredits() {
  let log = new Logger().with({ context: "getUserAvailableCredits" });

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

    const { data, error } = await supabase
      .from("userCredits")
      .select("availableCredits")
      .eq("userId", user.id);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return data[0];
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
