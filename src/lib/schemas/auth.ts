import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be 6 or more characters" }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
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
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    path: ["password"],
    message: "Passwords do not match",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
