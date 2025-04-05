"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { billingConfig } from "@/config/billing";
import { CreditPackId } from "@/lib/types/billing";
import { formatPrice } from "@/lib/utils";
import { CoinsIcon, CreditCardIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import purchaseCreditsAction from "../_actions/purchase-credits-action";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const TOAST_ID = "credit-purchase";

export default function CreditPurchase() {
  const [selectedPackId, setSelectedPackId] = useState(CreditPackId.Large);
  const { execute, isPending } = useAction(purchaseCreditsAction, {
    onExecute: () =>
      toast.loading("Creating checkout session...", { id: TOAST_ID }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => {
      toast.error(userErrorMessages.Unexpected, { id: TOAST_ID });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CoinsIcon className="stroke-primary size-6 dark:stroke-blue-500" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you would like to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPackId}
          onValueChange={(value: CreditPackId) => setSelectedPackId(value)}
        >
          {billingConfig.creditPacks.map((pack) => (
            <div
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className="bg-secondary/50 hover:bg-secondary flex items-center gap-3 rounded-lg p-3"
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex w-full cursor-pointer justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {pack.name} - {pack.label}
                  </span>
                  {pack.id === CreditPackId.Large && <Badge>Best value</Badge>}
                </div>
                <span className="text-primary font-bold dark:text-blue-500">
                  {formatPrice(pack.price / 100, "ZAR")}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <ButtonWithSpinner
          onClick={() => execute({ creditPackId: selectedPackId })}
          loading={isPending}
          startIcon={<CreditCardIcon />}
          className="w-full"
        >
          Purchase credits
        </ButtonWithSpinner>
      </CardFooter>
    </Card>
  );

  function handleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: TOAST_ID });
    }

    toast.success("Checkout session created", { id: TOAST_ID });
  }
}
