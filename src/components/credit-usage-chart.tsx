"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CoinsIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import getPeriodCreditUsage from "../app/(app)/dashboard/_data-access/get-period-credit-usage";

const chartConfig = {
  success: {
    label: "Successful task credits",
    color: "var(--chart-1)",
  },
  failed: {
    label: "Failed task credits",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  title: string;
  description: string;
  data: Awaited<ReturnType<typeof getPeriodCreditUsage>>;
};

export default function CreditUsageChart({ title, description, data }: Props) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          {/* <ChartColumnStackedIcon className="stroke-primary size-6 dark:stroke-blue-500" /> */}
          <CoinsIcon className="stroke-primary size-6 dark:stroke-blue-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data ?? undefined}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              dataKey="success"
              stackId="a"
              stroke="var(--color-success)"
              fill="var(--color-success)"
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="failed"
              stackId="a"
              stroke="var(--color-failed)"
              fill="var(--color-failed)"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
