import { Bot } from "lucide-react";

export default function Logo() {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-sidebar-primary-foreground">
        <Bot className="size-4" />
      </div>
      <div className="text-left text-2xl font-extrabold leading-tight">
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="text-stone-700 dark:text-stone-300">Bot</span>
      </div>
    </>
  );
}
