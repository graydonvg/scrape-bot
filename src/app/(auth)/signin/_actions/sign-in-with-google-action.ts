"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function signInWithGoogleAction() {
  let log = new Logger();
  log = log.with({ context: "signInWithPasswordAction" });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      log.warn("Failed to sign in. A user session already exists.", user);
      return {
        success: false,
        message: "Unable to sign in",
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      log.error("OAuth error", {
        error,
      });

      return {
        success: false,
        message: USER_ERROR_MESSAGES.Unexpected,
      };
    }

    redirect(data.url);
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.Unexpected,
    };
  }
}
