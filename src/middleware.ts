import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/supabase-middleware";

export async function middleware(request: NextRequest) {
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
    "/((?!_next/static|_next/image|favicon.ico|api/auth/callback|api/workflows|api/webhooks/stripe|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
