import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { fontInter } from "@/fonts/inter-font";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-inter antialiased", fontInter.variable)}>
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
