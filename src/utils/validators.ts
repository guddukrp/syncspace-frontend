import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Display name is required').max(120),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const workspaceSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  description: z.string().max(1000).optional(),
});

export const addWorkspaceMemberSchema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  description: z.string().max(1000).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
});
