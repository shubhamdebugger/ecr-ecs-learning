import { z } from 'zod';

const urlString = z
  .string({ required_error: 'URL is required' })
  .url('Please provide a valid URL')
  .max(2048, 'URL must not exceed 2048 characters');

const aliasString = z
  .string()
  .min(3, 'Alias must be at least 3 characters')
  .max(50, 'Alias must not exceed 50 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Alias can only contain letters, numbers, hyphens, and underscores',
  )
  .toLowerCase()
  .trim();

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: urlString,
    customAlias: aliasString.optional(),
    title: z
      .string()
      .max(100, 'Title must not exceed 100 characters')
      .trim()
      .optional(),
    expiresAt: z
      .string()
      .datetime({ message: 'Please provide a valid date' })
      .refine(
        (date) => new Date(date) > new Date(),
        'Expiration date must be in the future',
      )
      .transform((date) => new Date(date))
      .optional(),
  }),
});

export const updateUrlSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'URL ID is required'),
  }),
  body: z.object({
    originalUrl: urlString.optional(),
    title: z
      .string()
      .max(100, 'Title must not exceed 100 characters')
      .trim()
      .optional(),
    expiresAt: z
      .string()
      .datetime({ message: 'Please provide a valid date' })
      .refine(
        (date) => new Date(date) > new Date(),
        'Expiration date must be in the future',
      )
      .transform((date) => new Date(date))
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const urlParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'URL ID is required'),
  }),
});

export const urlFiltersSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    page: z
      .string()
      .default('1')
      .transform(Number)
      .refine((n) => n >= 1, 'Page must be at least 1'),
    limit: z
      .string()
      .default('10')
      .transform(Number)
      .refine((n) => n >= 1 && n <= 100, 'Limit must be between 1 and 100'),
    sortBy: z.enum(['createdAt', 'clicks', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'URL ID is required'),
  }),
  body: z.object({
    isActive: z.boolean({ required_error: 'isActive is required' }),
  }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>['body'];
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>['body'];
export type UrlFiltersInput = z.infer<typeof urlFiltersSchema>['query'];
