import "server-only";

import Stripe from "stripe";
import getCreditPack from "./get-credit-pack";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { Logger } from "next-axiom";

export default async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session,
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

  const incrementAvailableCreditsPromise = supabaseService.rpc(
    "increment_available_credits",
    {
      user_id: userId,
      increment_amount: purchasedCreditPack?.credits,
    },
  );

  const insertUserPurchasePromise = supabaseService
    .from("userPurchases")
    .insert({
      userId: userId,
      stripeId: event.id!,
      amount: event.amount_total! / 100,
      currency: event.currency!,
      description: `${purchasedCreditPack.name} - ${purchasedCreditPack.label}`,
      status: "SUCCESS",
    });

  const results = await Promise.allSettled([
    incrementAvailableCreditsPromise,
    insertUserPurchasePromise,
  ]);

  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value.error) errors.push(result.value.error);

      if (result.value.data) {
        const incrementAvailableCreditsResult = result.value.data as
          | { success: true }
          | { success: false; message: string };

        if (!incrementAvailableCreditsResult.success) {
          errors.push({ error: incrementAvailableCreditsResult.message });
        }
      }
    }

    if (result.status === "rejected") errors.push(result.reason);
  }

  if (errors.length > 0) {
    log.error("Database error", {
      path: "/api/webhooks/stripe",
      function: "handleCheckoutSessionCompleted",
      errors,
    });
  }
}
