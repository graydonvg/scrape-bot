import Logo from "@/components/logo";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NavbarButtons from "./navbar-buttons";

export default function Navbar() {
  return (
    <nav className="bg-background flex h-16 items-center border-b">
      <div className="container flex justify-between px-6 py-0 lg:px-16 xl:px-24">
        <Logo />
        <Suspense fallback={<Skeleton className="h-8 w-20" />}>
          <NavbarButtons />
        </Suspense>
      </div>
    </nav>
  );
}
