import { z } from "zod";

export const deleteAccountSchema = z.object({
  customAvatarUrl: z.string().url().nullable(),
});

export type DeleteAccountSchemaType = z.infer<typeof deleteAccountSchema>;

export const userAvatarSchema = z.object({
  avatar: z.instanceof(File),
  currentCustomAvatarUrl: z.string().url().nullable(),
});

export type UserAvatarSchemaType = z.infer<typeof userAvatarSchema>;

export const userNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(50, { message: "First name cannot exceed 32 characters" })
    .or(z.literal(""))
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(50, { message: "Last name cannot exceed 32 characters" })
    .or(z.literal(""))
    .optional(),
});

export type UserNameSchemaType = z.infer<typeof userNameSchema>;

export const userPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be 6 or more characters" })
      .max(72, { message: "Password cannot exceed 72 characters" }),
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be 6 or more characters" })
      .max(72, { message: "Password cannot exceed 72 characters" }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be 6 or more characters" })
      .max(72, { message: "Password cannot exceed 72 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["newPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserPasswordSchemaType = z.infer<typeof userPasswordSchema>;
