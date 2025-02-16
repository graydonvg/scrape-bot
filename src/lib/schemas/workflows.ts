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
  id: z.number().positive(),
});

export type DeleteWorkflowSchemaType = z.infer<typeof deleteWorkflowSchema>;
