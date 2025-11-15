import { z } from 'zod';

export const categoriesSchema = z.object({
  plaidId: z.string().optional(),
  name: z
    .string()
    .min(2, 'Account name must be at least 2 characters long')
    .max(50, 'Account name too long'),
});

export type AccountInput = z.infer<typeof categoriesSchema>;
