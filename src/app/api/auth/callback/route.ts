import arcjet, { shield, detectBot, fixedWindow } from "@/lib/arcjet";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { NextResponse } from "next/server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    }),
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:VERCEL", "CATEGORY:SEARCH_ENGINE"],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "60s",
      max: 10,
    }),
  );

export async function GET(request: Request) {
  let log = new Logger();
  log = log.with({ context: "api/auth/callback" });

  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    const decision = await aj.protect(request);

    for (const { reason } of decision.results) {
      if (reason.isError()) {
        log.error("Arcjet error", { message: reason.message });
        return NextResponse.redirect(`${origin}/signin?success=false`);
      }
    }

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return NextResponse.json(
          { error: "You are suspicious!" },
          { status: 403 },
        );
      }

      if (decision.reason.isBot()) {
        return NextResponse.json({ error: "Forbidden!" }, { status: 403 });
      }

      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too Many Requests" },
          { status: 429 },
        );
      }
    }

    if (code) {
      const supabase = await createSupabaseServerClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
          // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    }

    log.error("Auth code exchange error", { code });
    return NextResponse.redirect(`${origin}/signin?success=false`);
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error("Internal Server Error", { error });
    return NextResponse.redirect(`${origin}/signin?success=false`);
  }
}
