import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(72, { message: "Password must be less than 72 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
