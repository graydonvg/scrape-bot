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
    .max(500, { message: "Maximum 500 characters allowed" })
    .optional(),
});

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string().uuid(),
});

export type DuplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>;

export const renameWorkflowSchema = duplicateWorkflowSchema;

export type RenameWorkflowSchemaType = z.infer<typeof duplicateWorkflowSchema>;

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

export const updateWorkflowCronSchema = z.object({
  workflowId: z.string().uuid(),
  cron: z.string().trim(),
});

export type UpdateWorkflowCronSchemaType = z.infer<
  typeof updateWorkflowCronSchema
>;

export const removeWorkflowScheduleSchema = z.object({
  workflowId: z.string().uuid(),
});

export type RemoveWorkflowScheduleSchemaType = z.infer<
  typeof removeWorkflowScheduleSchema
>;
