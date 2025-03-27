import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/supabase-middleware";
import arcjet, { shield, detectBot, tokenBucket } from "./lib/arcjet";
import { Logger } from "next-axiom";

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
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 100,
    }),
  );

export async function middleware(request: NextRequest) {
  let log = new Logger();
  log = log.with({ context: "middleware" });

  const decision = await aj.protect(request, { requested: 1 });

  for (const { reason } of decision.results) {
    if (reason.isError()) {
      log.error("Arcjet error", { error: reason.message });
      return NextResponse.json(
        { error: "Service Unavailable" },
        { status: 503 },
      );
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/callback (authentication callback)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth/callback|api/workflows|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
