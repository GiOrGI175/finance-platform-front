import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^-?\d+(\.\d{1,2})?$/, 'Amount must be a valid number'),
  payee: z.string().optional(),
  notes: z.string().optional(),
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  accountId: z.string().min(1, 'Account ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
