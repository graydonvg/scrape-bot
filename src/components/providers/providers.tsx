import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import ReactQueryProvider from "./react-query-provider";
import { SidebarProvider } from "../ui/sidebar";
import { cookies } from "next/headers";

type Props = {
  children: ReactNode;
};

export default async function Providers({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
