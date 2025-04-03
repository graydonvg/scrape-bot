import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      <h1 className="mb-5 text-4xl font-bold text-pretty sm:text-5xl lg:text-7xl">
        No-code Drag &amp; Drop <br />
        <span className="text-primary dark:text-blue-500">Web Scraper</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-sm text-pretty sm:text-base lg:text-lg">
        Build custom web scraping workflows effortlessly. Leverage an intuitive
        drag and drop interface, schedule your tasks seamlessly, and integrate
        AI for enhanced data extraction.
      </p>
      <Link href="/dashboard">
        <Button size="lg">Start building</Button>
      </Link>
    </div>
  );
}
