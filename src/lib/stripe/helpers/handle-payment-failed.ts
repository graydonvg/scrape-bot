import "server-only";

import Stripe from "stripe";
import getCreditPack from "./get-credit-pack";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { Logger } from "next-axiom";
import { loggerErrorMessages } from "@/lib/constants";

export default async function handlePaymentFailed(
  event: Stripe.PaymentIntent,
  log: Logger,
) {
  if (!event.metadata) {
    throw new Error("Missing metadata");
  }

  const { userId, creditPackId } = event.metadata;

  if (!userId) {
    throw new Error("Missing user ID");
  }

  if (!creditPackId) {
    throw new Error("Missing credit pack ID");
  }

  const purchasedCreditPack = getCreditPack(creditPackId);

  if (!purchasedCreditPack) {
    throw new Error("Purchased credit pack not found");
  }

  const supabaseService = createSupabaseService();

  const { error } = await supabaseService.from("userPurchases").insert({
    userId: userId,
    stripeId: event.id!,
    amount: 0,
    currency: event.currency!,
    description: `${purchasedCreditPack.name} - ${purchasedCreditPack.label}`,
  });

  if (error) {
    log.error(loggerErrorMessages.Insert, {
      path: "/api/webhooks/stripe",
      function: "handlePaymentFailed",
      error,
    });
  }
}
