import { Logger } from "next-axiom";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/stripe";
import handleCheckoutSessionCompleted from "@/lib/stripe/helpers/handle-checkout-session-completed";
import handlePaymentFailed from "@/lib/stripe/helpers/handle-payment-failed";

export async function POST(request: NextRequest) {
  const log = new Logger();

  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "checkout.session.completed":
        return await handleCheckoutSessionCompleted(event.data.object, log);

      case "payment_intent.payment_failed":
        return await handlePaymentFailed(event.data.object, log);

      default:
        break;
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    log.error("Stripe webhook error", { error });

    return NextResponse.json("Webhook error", { status: 400 });
  }
}
