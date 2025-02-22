import { BotIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  isLink?: boolean;
};

export default function Logo({ isLink }: Props) {
  const className = "flex items-center gap-2";

  return isLink ? (
    <Link href="/" aria-label="navigate to home page" className={className}>
      <LogoContent />
    </Link>
  ) : (
    <div className={className}>
      <LogoContent />
    </div>
  );
}

function LogoContent() {
  return (
    <>
      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-700 via-blue-600 to-blue-500">
        <BotIcon className="size-4" />
      </div>
      <div className="text-left text-2xl leading-tight font-extrabold">
        <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-500 dark:to-blue-400">
          Scrape
        </span>
        <span className="bg-linear-to-r from-stone-700 to-stone-600 bg-clip-text text-transparent dark:from-stone-300 dark:to-stone-200">
          Bot
        </span>
      </div>
    </>
  );
}
