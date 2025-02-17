"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Textarea } from "@/components/ui/textarea";
import createWorkflowAction from "../_actions/create-workflow-action";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

export default function CreateWorkflowForm() {
  const router = useRouter();
  const toastId = "create-workflow";
  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: { name: "", description: "" },
  });
  const { execute, isPending } = useAction(createWorkflowAction, {
    onSuccess: () => {
      toast.success("Workflow created", { id: toastId });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: toastId });
    },
    onExecute: () => {
      toast.loading("Creating workflow...", { id: toastId });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Name
                  <span className="text-primary text-xs dark:text-blue-500">
                    (required)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Provide a descriptive and unique name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Description
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    placeholder="Your description..."
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of what your workflow does.
                  <br />
                  This is optional, but can help you remember the
                  workflow&apos;s purpose.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full capitalize"
          >
            {!isPending ? "Proceed" : <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
