import { z } from 'zod';

// Helper function to create a schema with translations
export const createSignInSchema = (t: (key: string) => string) => 
  z.object({
    email: z
      .string()
      .min(1, t('errors.emailRequired') || 'Email is required')
      .email(t('errors.invalidEmail') || 'Invalid email address'),
    password: z
      .string()
      .min(1, t('errors.passwordRequired') || 'Password is required'),
    rememberMe: z.boolean().optional(),
  });

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;
