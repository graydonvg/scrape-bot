import CustomDialogHeader from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  SaveIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import updateWorkflowCronAction from "../_actions/update-workflow-cron-action";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { useEffect, useState } from "react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import removeWorkflowScheduleAction from "../_actions/remove-workflow-schedule-action";
import ButtonWithSpinner from "@/components/button-with-spinner";

const UPDATE_CRON_TOAST_ID = "update-cron";
const REMOVE_SCHEDULE_TOAST_ID = "remove-schedule";

type Props = {
  workflowId: string;
  cron: string | null;
};

export default function SchedulerDialog({ workflowId, cron }: Props) {
  const workflowHasValidCron = cron && cron.length > 0;
  const humanReadableSavedCron =
    workflowHasValidCron && cronstrue.toString(cron);
  const [cronExpression, setCronExpression] = useState(cron ?? "");
  const [humanReadableCron, setHumanReadableCron] = useState("");
  const [isCronValid, setIsCronValid] = useState(false);
  const {
    execute: executeUpdateWorkflowCron,
    isPending: updateWorkflowCronIsPending,
  } = useAction(updateWorkflowCronAction, {
    onExecute: () =>
      toast.loading("Saving schedule...", { id: UPDATE_CRON_TOAST_ID }),
    onSuccess: ({ data }) => handleUpdateCronSuccess(data),
    onError: () =>
      toast.error(userErrorMessages.Unexpected, { id: UPDATE_CRON_TOAST_ID }),
  });
  const {
    execute: executeRemoveWorkflowSchedule,
    isPending: removeWorkflowScheduleIsPending,
  } = useAction(removeWorkflowScheduleAction, {
    onExecute: () =>
      toast.loading("Removing schedule...", { id: REMOVE_SCHEDULE_TOAST_ID }),
    onSuccess: ({ data }) => handleRemoveScheduleSuccess(data),
    onError: () =>
      toast.error(userErrorMessages.Unexpected, {
        id: REMOVE_SCHEDULE_TOAST_ID,
      }),
  });

  useEffect(() => {
    try {
      CronExpressionParser.parse(cronExpression, {
        tz: "UTC",
      });

      const humanReadableCronStr = cronstrue.toString(cronExpression);

      setIsCronValid(true);
      setHumanReadableCron(humanReadableCronStr);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsCronValid(false);
    }
  }, [cronExpression]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && !updateWorkflowCronIsPending) setCronExpression(cron ?? "");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn("h-auto p-0! text-sm", {
            "text-warning": !workflowHasValidCron,
            "text-success dark:text-green-500": workflowHasValidCron,
          })}
        >
          {workflowHasValidCron && (
            <>
              <ClockIcon />
              {humanReadableSavedCron}
            </>
          )}
          {!workflowHasValidCron && (
            <>
              <TriangleAlertIcon />
              Set schedule
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Schedule Workflow Execution"
          icon={CalendarIcon}
          subtitle="Specify a cron expression to schedule periodic workflow executions. All times are in UTC."
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="cron-expression" className="text-sm font-medium">
            Cron Expression
          </Label>
          <Input
            id="cron-expression"
            placeholder="E.g. * * * * *"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            className="h-10 px-3 text-sm"
          />
          <p
            className={cn("text-sm", {
              "text-muted-foreground": isCronValid,
              "text-destructive": !isCronValid,
            })}
          >
            {isCronValid ? humanReadableCron : "Not a valid cron expression"}
          </p>
        </div>

        <DialogFooter className="mt-4 flex-col!">
          {workflowHasValidCron && (
            <ButtonWithSpinner
              variant="destructive"
              onClick={() => executeRemoveWorkflowSchedule({ workflowId })}
              disabled={
                removeWorkflowScheduleIsPending || updateWorkflowCronIsPending
              }
              loading={removeWorkflowScheduleIsPending}
              startIcon={<Trash2Icon className="size-4" />}
              className="w-full"
            >
              Remove current schedule
            </ButtonWithSpinner>
          )}

          <ButtonWithSpinner
            onClick={() =>
              executeUpdateWorkflowCron({ workflowId, cron: cronExpression })
            }
            disabled={
              updateWorkflowCronIsPending ||
              removeWorkflowScheduleIsPending ||
              cronExpression.trim() === cron ||
              !isCronValid
            }
            loading={updateWorkflowCronIsPending}
            startIcon={<SaveIcon className="size-4" />}
            className="w-full"
          >
            Save
          </ButtonWithSpinner>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  function handleUpdateCronSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: UPDATE_CRON_TOAST_ID });
    }

    toast.success("Schedule saved", { id: UPDATE_CRON_TOAST_ID });
  }

  function handleRemoveScheduleSuccess(data?: ActionReturn) {
    if (data && !data.success) {
      return toast.error(data.message, { id: REMOVE_SCHEDULE_TOAST_ID });
    }

    toast.success("Schedule removed", { id: REMOVE_SCHEDULE_TOAST_ID });
  }
}
