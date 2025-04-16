"use client";

import AnimatedCounter from "@/components/animated-counter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useUserStore from "@/lib/store/user-store";
import { CoinsIcon, Loader2Icon } from "lucide-react";

export default function BalanceCard() {
  const { userCreditBalance } = useUserStore();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Available Credits</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex min-h-11 items-center">
          {userCreditBalance !== null ? (
            <AnimatedCounter
              value={userCreditBalance ?? 0}
              className="text-primary text-4xl font-bold dark:text-blue-500"
            />
          ) : (
            <Loader2Icon className="stroke-primary size-8 animate-spin stroke-3 dark:stroke-blue-500" />
          )}
        </div>
      </CardContent>
      <CardFooter className="pr-[148px]">
        <p className="text-muted-foreground text-sm">
          Your workflows will stop executing if your credit balance is
          insufficient, and scheduling will be disabled until more credits are
          added.
        </p>
      </CardFooter>
      <CoinsIcon
        size={140}
        className="stroke-primary absolute right-0 bottom-0 opacity-10"
      />
    </Card>
  );
}
