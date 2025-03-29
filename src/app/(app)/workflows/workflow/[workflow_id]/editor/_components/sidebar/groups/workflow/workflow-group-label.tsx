import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { userErrorMessages } from "@/lib/constants";
import { Loader2Icon, NetworkIcon, PencilIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ActionReturn } from "@/lib/types/action";
import useWorkflowsStore from "@/lib/store/workflows-store";
import renameWorkflowAction from "@/app/(app)/workflows/_actions/rename-workflow-action";
import { RenameWorkflowSchemaType } from "@/lib/schemas/workflows";

type Props = {
  workflowId: string;
  workflowName: string;
  workflowDescription: string | null;
};

export default function WorkflowGroupLabel({
  workflowId,
  workflowName,
  workflowDescription,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { existingWorkflowNames } = useWorkflowsStore();
  const [renameWorkflow, setRenameWorkflow] = useState(false);
  const [newName, setNewName] = useState(workflowName);
  const { execute, isPending } = useAction(renameWorkflowAction, {
    onSuccess: ({ data }) => handleSuccess(data),
    onError: () => handleError(),
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
          ref={inputRef}
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
    const trimmedNewName = newName.trim();
    const workflowNameExists = existingWorkflowNames?.includes(trimmedNewName);

    if (workflowNameExists && trimmedNewName !== workflowName) {
      inputRef.current?.focus();
      return toast.error(
        `Workflow name "${trimmedNewName}" already exists. Please provide a unique name.`,
      );
    }

    setRenameWorkflow(false);

    if (trimmedNewName === workflowName || trimmedNewName.length === 0) {
      setNewName(workflowName);
      return;
    }

    toast.loading("Renaming worklfow...", { id: workflowId });
    setNewName(trimmedNewName);
    execute({
      workflowId,
      name: trimmedNewName,
      description: workflowDescription ?? undefined,
    });
  }

  function handleSuccess(data?: ActionReturn<keyof RenameWorkflowSchemaType>) {
    if (data && !data.success) {
      setRenameWorkflow(true);
      inputRef.current?.focus();
      return toast.error(data.message, { id: workflowId });
    }

    toast.success("Workflow renamed", { id: workflowId });
  }

  function handleError() {
    setNewName(workflowName);
    toast.error(userErrorMessages.Unexpected);
  }
}
