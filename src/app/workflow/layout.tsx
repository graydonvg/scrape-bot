import Logo from "@/components/logo";
import { ThemeMenu } from "@/components/theme/theme-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function WorkflowLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {children}
      <Separator />
      <footer className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeMenu />
      </footer>
    </div>
  );
}
