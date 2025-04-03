"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/lib/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type Props = {
  selectedPeriod: Period;
  periods: Period[] | null;
};

export default function PeriodSelectorClient({
  selectedPeriod,
  periods,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Select
      defaultValue={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[416px]">
        {periods?.map((period, index) => (
          <SelectItem
            key={index}
            value={`${period.month}-${period.year}`}
          >{`${MONTH_NAMES[period.month]} ${period.year}`}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
