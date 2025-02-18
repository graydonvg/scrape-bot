import {
  CreditCardIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";

export const routes = [
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
];

export const USER_ERROR_MESSAGES = {
  Unauthorized: "You need to be signed in to perform this action",
  Unexpected: "An unexpected error occurred. Please try again later.",
} as const;

export const LOGGER_ERROR_MESSAGES = {
  Unauthorized: "Unauthorized",
  Unexpected: "Unexpected error",
  Insert: "Insert error",
  Delete: "Delete error",
  Select: "Select error",
  Update: "Update error",
} as const;
