import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center min-h-screen flex-col">
      <div className="flex size-full flex-1 flex-col gap-4 p-6 md:p-10">
        <Link href="/" className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </Link>
        <div className="flex-center flex-1">
          <div className="flex-center flex-col text-center">
            <h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
            <h2 className="mb-4 text-2xl font-semibold capitalize">
              Page not found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md text-pretty">
              Don&apos;t worry, even the best data sometimes gets lost in the
              internet.
            </p>
            <Link href="/">
              <Button className="capitalize">
                <ArrowLeftIcon size={4} />
                back to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
