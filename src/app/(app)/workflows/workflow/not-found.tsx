import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="flex grow flex-col p-6 md:p-10">
      <div className="flex-center flex-1 flex-col text-center">
        <h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold capitalize">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md text-pretty">
          Don&apos;t worry, even the best data sometimes gets lost in the
          internet.
        </p>
      </div>
    </div>
  );
}
