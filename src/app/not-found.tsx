import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center min-h-screen flex-col p-4">
      <div className="text-center">
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
  );
}
