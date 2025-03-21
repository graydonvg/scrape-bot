import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import { Loader2Icon, NetworkIcon, PencilIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import renameWorkflowAction from "../../../../_actions/rename-workflow-action";

type Props = {
  workflowId: string;
  workflowName: string;
};

export default function WorkflowGroupLabel({
  workflowId,
  workflowName,
}: Props) {
  const [renameWorkflow, setRenameWorkflow] = useState(false);
  const [newName, setNewName] = useState(workflowName);
  const { execute, isPending } = useAction(renameWorkflowAction, {
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        setNewName(workflowName);

        return toast.error(data.message);
      }
    },
    onError: () => {
      setNewName(workflowName);

      toast.error(USER_ERROR_MESSAGES.Unexpected);
    },
  });

  return (
    <SidebarGroupLabel className="mb-2 rounded-none px-0">
      {!renameWorkflow ? (
        <Button
          onClick={() => setRenameWorkflow(true)}
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="text-foreground z-50 flex w-full items-center justify-between !px-2 text-base"
        >
          <div className="flex items-center gap-2">
            <NetworkIcon className="stroke-muted-foreground/80 -rotate-90" />
            <span className="truncate">{newName}</span>
          </div>
          {!isPending && <PencilIcon className="stroke-muted-foreground/80" />}
          {isPending && (
            <Loader2Icon className="stroke-muted-foreground/80 animate-spin" />
          )}
        </Button>
      ) : (
        <Input
          autoFocus
          onBlur={handleRenameWorkflow}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRenameWorkflow();
            }
          }}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="text-foreground px-2.5 text-base font-medium"
        />
      )}
    </SidebarGroupLabel>
  );

  function handleRenameWorkflow() {
    setRenameWorkflow(false);

    const trimmedNewName = newName.trim();

    if (trimmedNewName === workflowName) {
      setNewName(workflowName);
      return;
    }

    if (trimmedNewName.length === 0) {
      setNewName(workflowName);
      return;
    }

    setNewName(trimmedNewName);
    execute({ workflowId, workflowName: trimmedNewName });
  }
}
