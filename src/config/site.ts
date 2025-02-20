import {
  CreditCardIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";

export const siteConfig = {
  name: "ScrapeBot",
  // TODO: Provide better description.
  description: "An AI powered web scraper",
  navMain: [
    {
      href: "/",
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: "workflows",
      label: "Workflows",
      icon: Layers2Icon,
    },
    {
      href: "credentials",
      label: "Credentials",
      icon: ShieldCheckIcon,
    },
    {
      href: "billing",
      label: "Billing",
      icon: CreditCardIcon,
    },
  ],
};
