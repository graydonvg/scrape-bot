import { z } from "zod";

export const addCredentialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Maximum 50 characters allowed" }),
  value: z
    .string()
    .trim()
    .min(1, { message: "Value is required" })
    .max(500, { message: "Maximum 500 characters allowed" }),
});

export type AddCredentialSchemaType = z.infer<typeof addCredentialSchema>;

export const deleteCredentialSchema = z.object({
  credentialId: z.string().uuid(),
});

export type DeleteCredentialSchemaType = z.infer<typeof deleteCredentialSchema>;
