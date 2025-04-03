import {
  CreditCardIcon,
  Layers2Icon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
} from "lucide-react";

export const appConfig = {
  navMain: [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      href: "/workflows",
      label: "Workflows",
      icon: Layers2Icon,
    },
    {
      href: "/credentials",
      label: "Credentials",
      icon: ShieldCheckIcon,
    },
    {
      href: "/billing",
      label: "Billing",
      icon: CreditCardIcon,
    },
  ],
};
