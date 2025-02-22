import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  return (
    <header className="bg-background z-50 flex h-16 items-center justify-between border-b-2 px-2">
      <div>
        <TooltipWrapper tooltipContent="Back">
          <Link href="/workflows">
            <Button variant="ghost" size="icon">
              <ChevronLeftIcon size={20} />
            </Button>
          </Link>
        </TooltipWrapper>
      </div>
    </header>
  );
}
