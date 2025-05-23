import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { fontInter } from "@/fonts/inter-font";
import { siteConfig } from "@/config/site";
import Providers from "@/components/providers/providers";
import { ReactNode } from "react";

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
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
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-inter antialiased", fontInter.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
