import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { AxiomRequest, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(
  async (
    request: AxiomRequest,
    { params }: { params: Promise<{ user_purchase_id: string }> },
  ) => {
    try {
      let log = request.log;
      const { user_purchase_id } = await params;

      if (!user_purchase_id) {
        return NextResponse.json("Purchase ID missing", { status: 400 });
      }

      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json("Unauthorized", { status: 401 });
      }

      log = log.with({ userId: user.id });

      const { data, error } = await supabase
        .from("userPurchases")
        .select("stripeId")
        .eq("userId", user.id)
        .eq("userPurchaseId", user_purchase_id);

      if (error) {
        request.log?.error(loggerErrorMessages.Select, { error });
        return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
      }

      const session = await stripe.checkout.sessions.retrieve(data[0].stripeId);

      if (!session.invoice) {
        log.error("No invoice found");
        return NextResponse.json("Invoice not found", { status: 404 });
      }

      const invoice = await stripe.invoices.retrieve(session.invoice as string);

      return NextResponse.json(invoice.hosted_invoice_url, { status: 200 });
    } catch (error) {
      request.log?.error(loggerErrorMessages.Unexpected, { error });

      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }
  },
);
