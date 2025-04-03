import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import arcjet, { shield, detectBot, tokenBucket } from "../arcjet";
import { Logger } from "next-axiom";
import ip from "@arcjet/ip";
import { User } from "@supabase/supabase-js";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let log = new Logger();
  log = log.with({ context: "middleware" });

  // Next.js 15 doesn't provide the IP address in the request object so we use
  // the Arcjet utility package to parse the headers and find it. If we're
  // running in development mode, we'll use a local IP address
  const userIp =
    process.env.NODE_ENV === "development" ? "127.0.0.1" : ip(request);

  // Use the user ID if the user is logged in, otherwise use the IP address
  const fingerprint = user?.id ?? userIp;

  const decision = await getArcjetClient(user).protect(request, {
    requested: 1,
    fingerprint,
  });

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

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/") &&
    !request.nextUrl.pathname.startsWith("/signin") &&
    !request.nextUrl.pathname.startsWith("/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

function getArcjetClient(user: User | null) {
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
    );

  // Returns ad-hoc rules depending on whether the user is signed in.
  if (user) {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        refillRate: 10,
        interval: 60,
        capacity: 100,
      }),
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        refillRate: 10,
        interval: 60,
        capacity: 10,
      }),
    );
  }
}
