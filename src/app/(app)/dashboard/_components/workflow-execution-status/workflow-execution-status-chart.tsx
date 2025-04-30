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
import getWorkflowExecutionStats from "../../_data-access/get-workflow-execution-stats";
import { Layers2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  success: {
    label: "Success",
    color: "var(--chart-1)",
  },
  partiallyFailed: {
    label: "Partially Failed",
    color: "var(--chart-3)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  data: Awaited<ReturnType<typeof getWorkflowExecutionStats>>;
};

export default function WorkflowExecutionStatusChart({ data }: Props) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Layers2Icon className="stroke-primary size-6 dark:stroke-blue-500" />
          <h2>Workflow execution status</h2>
        </CardTitle>
        <CardDescription className="text-pretty">
          <p>
            Daily number of successful, failed, and partially failed workflow
            executions for the selected period.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
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
            <Area
              dataKey="success"
              stackId="a"
              min={0}
              type="bump"
              stroke="var(--color-success)"
              fill="var(--color-success)"
              fillOpacity={0.6}
            />
            <Area
              dataKey="partiallyFailed"
              stackId="a"
              min={0}
              type="bump"
              stroke="var(--color-partiallyFailed)"
              fill="var(--color-partiallyFailed)"
              fillOpacity={0.6}
            />
            <Area
              dataKey="failed"
              stackId="a"
              min={0}
              type="bump"
              stroke="var(--color-failed)"
              fill="var(--color-failed)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
