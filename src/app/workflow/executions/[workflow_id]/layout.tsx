import Logo from "@/components/logo";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function WorkflowExecutionHistoryLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {children}
      <footer className="bg-sidebar flex h-16 items-center justify-between border-t px-4">
        <Logo isLink />
      </footer>
    </div>
  );
}
