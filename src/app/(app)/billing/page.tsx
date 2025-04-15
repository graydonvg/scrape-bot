import PageHeader from "@/components/page-header";
import BalanceCard from "./_components/balance-card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CreditPurchase from "./_components/credit-purchase";
import CreditUsageCard from "./_components/credit-usage-card";
import TransactionHistoryCard from "./_components/transaction-history-card";

export default function BillingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Billing" />
      <div className="space-y-8">
        <Suspense fallback={<Skeleton className="h-[170px] w-full" />}>
          <BalanceCard />
        </Suspense>
        <CreditPurchase />
        <Suspense
          fallback={<Skeleton className="col-span-3 h-[331px] w-full" />}
        >
          <CreditUsageCard />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="col-span-3 h-[517px] w-full" />}
        >
          <TransactionHistoryCard />
        </Suspense>
      </div>
    </div>
  );
}
