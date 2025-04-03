import { Suspense } from "react";
import PeriodSelectorServer from "./_components/period-selector/period-selector-server";
import { Period } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/page-header";
import StatsCards from "./_components/stats-cards/stats-cards";
import StatsCardSkeleton from "./_components/stats-cards/stats-card-skeleton";
import WorkflowExecutionStatus from "./_components/workflow-execution-status/workflow-execution-status";
import PeriodCreditUsage from "./_components/period-credit-usage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

type Params = {
  searchParams: Promise<{ month?: string; year?: string }>;
};

export default async function DashboardPage({ searchParams }: Params) {
  const currentDate = new Date();
  const params = await searchParams;
  const { month, year } = params;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Dashboard">
        <Suspense fallback={<Skeleton className="h-9 w-[180px]" />}>
          <PeriodSelectorServer selectedPeriod={period} />
        </Suspense>
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="col-span-3 h-[300px] w-full" />}
        >
          <WorkflowExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="col-span-3 h-[300px] w-full" />}
        >
          <PeriodCreditUsage selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}
