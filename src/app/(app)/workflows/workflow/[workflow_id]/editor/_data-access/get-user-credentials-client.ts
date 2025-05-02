import { loggerErrorMessages } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Logger } from "next-axiom";

export default async function getUserCredentialsClient() {
  let log = new Logger().with({ context: "getUserCredentialsClient" });

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
      .from("credentials")
      .select("credentialId, name")
      .eq("userId", user.id)
      .order("name", { ascending: true });

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return data;
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
