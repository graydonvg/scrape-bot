import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

export default function TaskBadge({ icon, label, value }: Props) {
  const Icon = icon;

  return (
    <Badge variant="outline" className="space-x-2 py-1">
      <div className="flex-center gap-2">
        <Icon size={18} className="stroke-muted-foreground" />
        <span>{label}:</span>
      </div>
      {value}
    </Badge>
  );
}
