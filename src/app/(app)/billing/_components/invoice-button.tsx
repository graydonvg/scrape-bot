"use client";

import { useQueryClient } from "@tanstack/react-query";
import getInvoice from "../services/get-invoice";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { toast } from "sonner";
import { useState } from "react";
import { useLogger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { DownloadIcon } from "lucide-react";

type Props = {
  purchaseId: string;
};

export default function InvoiceButton({ purchaseId }: Props) {
  const queryClient = useQueryClient();
  const logger = useLogger();
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnClick() {
    setIsLoading(true);

    try {
      const result = await queryClient.fetchQuery({
        queryKey: [purchaseId],
        queryFn: () => getInvoice(purchaseId),
      });

      if (!result.success) {
        return toast.error(result.message);
      }

      window.open(result.data, "_blank");
    } catch (error) {
      logger.error(loggerErrorMessages.Unexpected, { error });
      toast.error(userErrorMessages.Unexpected);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ButtonWithSpinner
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      loading={isLoading}
      startIcon={<DownloadIcon className="size-3" />}
      className="text-muted-foreground px-1! text-xs"
      spinnerClassName="size-3"
    >
      Invoice
    </ButtonWithSpinner>
  );
}
