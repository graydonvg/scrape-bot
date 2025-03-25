import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Maximum 50 characters allowed" }),
  description: z
    .string()
    .trim()
    .max(80, { message: "Maximum 80 characters allowed" })
    .optional(),
});

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

export const deleteWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
});

export type DeleteWorkflowSchemaType = z.infer<typeof deleteWorkflowSchema>;

export const saveWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  definition: z.string(),
});

export type SaveWorkflowSchemaType = z.infer<typeof saveWorkflowSchema>;

export const publishWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  definition: z.string(),
});

export type PublishWorkflowSchemaType = z.infer<typeof publishWorkflowSchema>;

export const unpublishWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
});

export type UnpublishWorkflowSchemaType = z.infer<
  typeof unpublishWorkflowSchema
>;

export const executeWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  definition: z.string().optional(),
});

export type ExecuteWorkflowSchemaType = z.infer<typeof executeWorkflowSchema>;

export const renameWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  workflowName: z.string(),
});

export type RenameWorkflowSchemaType = z.infer<typeof renameWorkflowSchema>;
