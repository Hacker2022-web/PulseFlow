import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional().default(false)
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirm password is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export function validateLoginForm(data: unknown): {
  success: boolean;
  data?: LoginInput;
  errors?: Partial<Record<keyof LoginInput, string>>;
} {
  const result = loginSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Partial<Record<keyof LoginInput, string>> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof LoginInput;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  });

  return { success: false, errors };
}

export function validateSignUpForm(data: unknown): {
  success: boolean;
  data?: SignUpInput;
  errors?: Partial<Record<keyof SignUpInput, string>>;
} {
  const result = signUpSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Partial<Record<keyof SignUpInput, string>> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof SignUpInput;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  });

  return { success: false, errors };
}
