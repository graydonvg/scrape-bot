import { z } from "zod";
import { CreditPackId } from "../types/billing";

export const purchaseCreditsSchema = z.object({
  creditPackId: z.nativeEnum(CreditPackId),
});

export type PurchaseCreditsSchemaType = z.infer<typeof purchaseCreditsSchema>;
