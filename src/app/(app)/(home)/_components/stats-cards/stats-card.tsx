import AnimatedCounter from "@/components/animated-counter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  value: number;
  icon: LucideIcon;
};

export default function StatsCard({ title, description, value, icon }: Props) {
  const Icon = icon;
  return (
    <Card className="relative col-span-3 flex min-h-[120px] flex-col justify-between overflow-hidden lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-xs text-pretty">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-primary text-2xl font-bold dark:text-blue-500">
          <AnimatedCounter value={value} />
        </div>
      </CardContent>
      <Icon
        size={120}
        className="text-muted-foreground stroke-primary absolute -right-8 -bottom-4 opacity-20 dark:opacity-10"
      />
    </Card>
  );
}
