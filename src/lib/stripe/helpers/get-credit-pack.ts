import { billingConfig } from "@/config/billing";

export default function getCreditPack(packId: string) {
  return billingConfig.creditPacks.find((pack) => pack.id === packId);
}
