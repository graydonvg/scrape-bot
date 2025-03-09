import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useLogger } from "next-axiom";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  label: string;
  value: string;
};

export default function TaskParameter({ label, value }: Props) {
  const log = useLogger();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center">
      <Label className="mr-2 basis-1/3 whitespace-nowrap">{label}:</Label>
      <div className="relative flex basis-2/3 items-center">
        <Input
          ref={inputRef}
          readOnly
          value={value}
          className="pointer-events-none truncate pr-12"
        />
        {!copied ? (
          <TooltipWrapper tooltipContent="Copy to clipboard">
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="absolute right-2 size-6"
            >
              <CopyIcon />
            </Button>
          </TooltipWrapper>
        ) : (
          <div className="flex-center absolute right-2 size-6">
            <CopyCheckIcon
              size={16}
              className="stroke-success dark:stroke-green-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  async function handleCopy() {
    const input = inputRef.current;
    const inputValue = input?.value;

    if (!inputValue) return;

    try {
      await navigator.clipboard.writeText(inputValue);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      log.error("Copy to clipboard error", { error });
      toast.error("Failed to copy");
    }
  }
}
