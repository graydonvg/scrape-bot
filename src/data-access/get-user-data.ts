import "server-only";

import { cache } from "react";
import { loggerErrorMessages } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

const getUserData = cache(async function getUserData() {
  let log = new Logger().with({ context: "getUserData" });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(loggerErrorMessages.Unauthorized);
      redirect("/signin");
    }

    log = log.with({ userId: user.id });

    const { data, error } = await supabase
      .from("users")
      .select(
        "userId, email, firstName, lastName, providerAvatarUrl, customAvatarUrl",
      )
      .eq("userId", user.id);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    const userData = {
      ...data[0],
      provider: user.app_metadata.provider,
    };

    return userData;
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
});

export default getUserData;
