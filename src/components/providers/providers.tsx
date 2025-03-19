import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import ReactQueryProvider from "./react-query-provider";
import NextTopLoader from "nextjs-toploader";

type Props = {
  children: ReactNode;
};

export default async function Providers({ children }: Props) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextTopLoader color="#3b82f6" showSpinner={false} height={2} />
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
