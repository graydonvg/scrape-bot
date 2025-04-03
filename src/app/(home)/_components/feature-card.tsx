import { LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function FeatureCard({ title, description, icon }: Props) {
  const Icon = icon;

  return (
    <Card className="shadow-primary/30 relative col-span-3 overflow-hidden lg:col-span-1">
      <CardHeader>
        <CardTitle className="mb-2 flex items-center gap-2">
          <Icon size={16} />
          <h2 className="text-base font-semibold">{title}</h2>
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-pretty">{description}</p>
        </CardDescription>
      </CardHeader>
      <Icon
        size={120}
        className="stroke-primary absolute -right-8 -bottom-4 opacity-10"
      />
    </Card>
  );
}
