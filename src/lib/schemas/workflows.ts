import { z } from "zod";
import { jsonSchema } from "./json";

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
  workflowId: z.number().positive(),
});

export type DeleteWorkflowSchemaType = z.infer<typeof deleteWorkflowSchema>;

export const saveWorkflowSchema = z.object({
  workflowId: z.number().positive(),
  definition: jsonSchema,
  // .max(80, { message: "Maximum 80 characters allowed" })
});

export type SaveWorkflowSchemaType = z.infer<typeof saveWorkflowSchema>;
