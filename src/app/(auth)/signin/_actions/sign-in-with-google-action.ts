"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { siteConfig } from "@/config/site";

export default async function signInWithGoogleAction() {
  const log = new Logger().with({ context: "signInWithPasswordAction" });

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
        redirectTo: `${siteConfig.siteUrl}/api/auth/callback?next=/dashboard`,
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
        message: userErrorMessages.Unexpected,
      };
    }

    redirect(data.url);
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return {
      success: false,
      message: userErrorMessages.Unexpected,
    };
  }
}
