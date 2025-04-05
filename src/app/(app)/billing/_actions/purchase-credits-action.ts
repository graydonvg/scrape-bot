"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import {
  purchaseCreditsSchema,
  PurchaseCreditsSchemaType,
} from "@/lib/schemas/billing";
import { billingConfig } from "@/config/billing";
import { stripe } from "@/lib/stripe/stripe";
import { siteConfig } from "@/config/site";
import getCreditPack from "@/lib/stripe/helpers/get-credit-pack";

const purchaseCreditsAction = actionClient
  .metadata({ actionName: "purchaseCreditsAction" })
  .schema(purchaseCreditsSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: PurchaseCreditsSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "purchaseCreditsAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(loggerErrorMessages.Unauthorized, { formData });
          redirect("/signin");
        }

        log = log.with({ userId: user.id });

        const selectedCreditPack = getCreditPack(formData.creditPackId);

        if (!selectedCreditPack) {
          log.error("Selected credit pack not found", {
            formData,
            creditPacks: billingConfig.creditPacks,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          invoice_creation: {
            enabled: true,
          },
          success_url: siteConfig.siteUrl + "/billing",
          cancel_url: siteConfig.siteUrl + "/billing",
          payment_intent_data: {
            metadata: {
              userId: user.id,
              creditPackId: selectedCreditPack.id,
            },
          },
          metadata: {
            userId: user.id,
            creditPackId: selectedCreditPack.id,
          },
          line_items: [
            {
              quantity: 1,
              price: selectedCreditPack.stripePriceId,
            },
          ],
        });

        if (!session.url) {
          log.error("Failed to create stripe session", {
            sessionParams: {
              success_url: siteConfig.siteUrl + "/billing",
              cancel_url: siteConfig.siteUrl + "/billing",
              metadata: {
                userId: user.id,
                creditPackId: selectedCreditPack.id,
              },
              line_items: [
                {
                  quantity: 1,
                  price: selectedCreditPack.stripePriceId,
                },
              ],
            },
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        redirect(session.url);
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
    },
  );

export default purchaseCreditsAction;
