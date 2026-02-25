// validations/user.validation.js

import { z } from "zod";

export const userValidationSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email format"),

  mobileno: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});
