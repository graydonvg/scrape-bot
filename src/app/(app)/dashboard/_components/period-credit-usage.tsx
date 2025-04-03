import { Period } from "@/lib/types/analytics";
import getPeriodCreditUsage from "../_data-access/get-period-credit-usage";
import CreditUsageChart from "../../../../components/credit-usage-chart";

type Props = {
  selectedPeriod: Period;
};

export default async function PeriodCreditUsage({ selectedPeriod }: Props) {
  const data = await getPeriodCreditUsage(selectedPeriod);

  return (
    <CreditUsageChart
      title="Credits consumed"
      description="Daily number of credits consumed for the selected period"
      data={data}
    />
  );
}
