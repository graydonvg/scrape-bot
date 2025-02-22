import Logo from "@/components/logo";
import { siteConfig } from "@/config/site";
import { BotIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import workflowImage from "../../../public/workflow.jpg";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <main className="divide-border grid min-h-svh divide-x lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 lg:justify-start">
          <Logo />
        </div>
        <div className="flex-center flex-1">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </section>
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={workflowImage}
          alt="workflow image"
          placeholder="blur"
          fill
          className="pointer-events-none size-full scale-200 object-cover blur-xs brightness-25 grayscale-25 select-none"
        />
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
            <p className="text-xl text-white/70">{siteConfig.description}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
