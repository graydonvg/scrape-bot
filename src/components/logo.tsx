import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
  iconSize?: number;
};

export default function Logo({ className, iconSize = 20 }: Props) {
  return (
    <Link
      href="/"
      aria-label="navigate to home page"
      className={cn(
        "flex items-center gap-2 text-2xl font-extrabold",
        className,
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        <Bot size={iconSize} className="stroke-white" />
      </div>

      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="text-stone-700 dark:text-stone-300">Bot</span>
      </div>
    </Link>
  );
}
