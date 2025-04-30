import { Period } from "@/lib/types/analytics";
import getStatsCardsValues from "../../_data-access/get-stats-cards-values";
import StatsCard from "./stats-card";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import CustomAlert from "@/components/custom-alert";

type Props = {
  selectedPeriod: Period;
};

export default async function StatsCards({ selectedPeriod }: Props) {
  const data = await getStatsCardsValues(selectedPeriod);

  if (!data)
    return (
      <CustomAlert
        variant="destructive"
        title="Error"
        description="Something went wrong. Please try again later."
      />
    );

  return (
    <>
      <StatsCard
        title="Workflow executions"
        description="Total workflow executions for the selected period."
        value={data?.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Task executions"
        description="Total task executions for the selected period."
        value={data?.taskExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        description="Total credits consumed for the selected period."
        value={data?.creditsConsumed}
        icon={CoinsIcon}
      />
    </>
  );
}
