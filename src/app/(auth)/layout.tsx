import Logo from "@/components/logo";
import { BotIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode, Suspense } from "react";
import workflowImage from "../../../public/scrapebot-workflow-grid.jpg";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <main className="divide-border grid min-h-svh divide-x lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-6">
        <Logo />
        <div className="flex-center flex-1">
          <div className="w-full max-w-xs">
            {/* Suspense boundary is required because the signin pages includes useSearchParams()  */}
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </div>
      </section>
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={workflowImage}
          alt="workflow image"
          placeholder="blur"
          fill
          priority
          className="pointer-events-none size-full object-cover select-none"
        />
        <div className="from-primary/20 absolute inset-0 z-40 bg-radial to-[hsl(20,14.3%,4.1%)]"></div>
        <div className="flex-center absolute inset-0 z-50 flex-col gap-4">
          <div className="text-sidebar-primary-foreground flex aspect-square size-16 items-center justify-center rounded-lg bg-linear-to-r from-blue-700 via-blue-600 to-blue-500">
            <BotIcon className="size-1/2" />
          </div>
          <div className="flex-center flex-col gap-2">
            <h1 className="text-4xl font-black whitespace-nowrap text-white">
              Welcome to{" "}
              <span className="text-left leading-tight font-extrabold">
                <span className="bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Scrape
                </span>
                <span className="bg-linear-to-r from-stone-300 to-stone-200 bg-clip-text text-transparent">
                  Bot
                </span>
              </span>
            </h1>
            <Separator />
            <p className="text-center text-lg text-pretty text-white/70">
              Visually build and manage web scrapers
              <br />
              without writing any code.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
