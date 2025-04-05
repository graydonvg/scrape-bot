import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function getUserPurchaseHistory() {
  let log = new Logger();
  log = log.with({ context: "getUserPurchaseHistory" });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(loggerErrorMessages.Unauthorized);
      return redirect("/signin");
    }

    log = log.with({ userId: user.id });

    const { data, error } = await supabase
      .from("userPurchases")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return data;
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
}
