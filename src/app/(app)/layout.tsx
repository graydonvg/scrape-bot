import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./_components/sidebar/app-sidebar";
import AppHeader from "./_components/app-header";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Separator orientation="horizontal" className="z-50" />
        <div className="container">{children}</div>
      </SidebarInset>
    </>
  );
}
