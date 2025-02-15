import { CreditCard, Home, Layers2, ShieldCheck } from "lucide-react";

export const routes = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheck,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CreditCard,
  },
];
