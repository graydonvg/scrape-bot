import { Period } from "@/lib/types/analytics";
import getPeriods from "../../_data-access/get-periods";
import PeriodSelectorClient from "./period-selector-client";

type Props = {
  selectedPeriod: Period;
};

export default async function PeriodSelectorServer({ selectedPeriod }: Props) {
  const periods = await getPeriods();

  return (
    <PeriodSelectorClient selectedPeriod={selectedPeriod} periods={periods} />
  );
}
