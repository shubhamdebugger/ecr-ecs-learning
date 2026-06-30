import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http.constants';
import { sendError } from '../utilities/response.util';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body as unknown,
      query: req.query,
      params: req.params,
      cookies: req.cookies as unknown,
    });

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.slice(1).join('.');
        const key = path || 'general';
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      });

      sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', errors);
      return;
    }

    if (result.data.body !== undefined) req.body = result.data.body as Record<string, unknown>;
    if (result.data.query !== undefined) {
      const validatedQuery = result.data.query as Record<string, unknown>;
      Object.assign(req.query, validatedQuery);
    }

    next();
  };
};

export const mongoIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});
