"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import ReactQueryProvider from "./react-query-provider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
