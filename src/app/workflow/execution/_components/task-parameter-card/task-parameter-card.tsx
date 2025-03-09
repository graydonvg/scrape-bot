import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Json } from "@/lib/supabase/database.types";
import { TaskParamName } from "@/lib/types/task";
import TaskParameter from "./task-parameter";

type Props = {
  title: string;
  subtitle: string;
  fallbackText: string;
  paramsJson: Json;
  includesBrowserInstance: boolean;
};

export default function TaskParameterCard({
  title,
  subtitle,
  fallbackText,
  paramsJson,
  includesBrowserInstance,
}: Props) {
  const params: Record<TaskParamName, string> = paramsJson
    ? JSON.parse(paramsJson as string)
    : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted dark:bg-background rounded-t-lg py-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) &&
            !includesBrowserInstance && (
              <p className="text-sm">{fallbackText}</p>
            )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <TaskParameter key={key} label={key} value={value} />
            ))}
          {includesBrowserInstance && (
            <div className="flex h-9 items-center">
              <p className="text-sm leading-none font-medium whitespace-nowrap select-none">
                {TaskParamName.WebPage}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
