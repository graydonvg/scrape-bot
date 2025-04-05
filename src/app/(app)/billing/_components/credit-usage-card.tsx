import CreditUsageChart from "@/components/credit-usage-chart";
import getPeriodCreditUsage from "@/data-access/get-period-credit-usage";
import { Period } from "@/lib/types/analytics";

export default async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await getPeriodCreditUsage(period);

  return (
    <CreditUsageChart
      title="Credits consumed"
      description="Daily number of credits consumed this month"
      data={data}
    />
  );
}
