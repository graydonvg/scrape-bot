import {
  CreditCardIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";

export const siteConfig = {
  name: "ScrapeBot",
  description:
    "A platform to visually create and manage web scrapers without writing code. Simplifying data extraction with an intuitive drag-and-drop interface and a scheduling system for automating data collection. Additionally, it includes the option to integrate AI into the web scraping process if desired.",
  navMain: [
    {
      href: "/",
      label: "Home",
      icon: HomeIcon,
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
