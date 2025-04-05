import { CreditPack, CreditPackId } from "@/lib/types/billing";

export const billingConfig = {
  creditPacks: [
    {
      id: CreditPackId.Small,
      name: "Small Pack",
      label: "1,000 credits",
      credits: 1000,
      price: 199_00, // ZAR 199.00
      stripePriceId: process.env.STRIPE_SMALL_PACK_PRICE_ID,
    },
    {
      id: CreditPackId.Medium,
      name: "Medium Pack",
      label: "5,000 credits",
      credits: 5000,
      price: 899_00, // ZAR 899.00
      stripePriceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID,
    },
    {
      id: CreditPackId.Large,
      name: "Large Pack",
      label: "10,000 credits",
      credits: 10_000,
      price: 1_699_00, // ZAR 1,699.00
      stripePriceId: process.env.STRIPE_LARGE_PACK_PRICE_ID,
    },
  ] as CreditPack[],
};
