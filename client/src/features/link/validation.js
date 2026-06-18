import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email format'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        confirm_password: z
            .string()
            .min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Token is required'),
        new_password: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        confirm_password: z
            .string()
            .min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

// Untuk create link — sesuai CreateShortLinkRequest di backend
export const createLinkSchema = z.object({
    original_url: z
        .string()
        .min(10, 'URL minimum 10 characters')
        .url('Enter a valid URL (example: https://example.com)'),
    optional_slug: z
        .string()
        .min(6, 'Slug minimum 6 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Slugs can only be letters, numbers, - and _')
        .optional()
        .or(z.literal('')),
});