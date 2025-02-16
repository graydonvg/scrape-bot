import { BotIcon } from "lucide-react";

export default function Logo() {
  return (
    <>
      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-700 via-blue-600 to-blue-500">
        <BotIcon className="size-4" />
      </div>
      <div className="text-left text-2xl leading-tight font-extrabold">
        <span className="bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="text-stone-700 dark:text-stone-300">Bot</span>
      </div>
    </>
  );
}
