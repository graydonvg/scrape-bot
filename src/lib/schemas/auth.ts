import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be 6 or more characters long" }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be 6 or more characters long" }),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
