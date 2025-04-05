export enum CreditPackId {
  Small = "SMALL",
  Medium = "MEDIUM",
  Large = "LARGE",
}

export type CreditPack = {
  id: CreditPackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  stripePriceId: string;
};
