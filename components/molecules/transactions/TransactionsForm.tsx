import { z } from 'zod';
import { accountSchema } from '@/lib/schema/account.shcema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { transactionSchema } from '@/lib/schema/transactions.shcema';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/ui/amount-input';
import { convertAmountToMiliunits } from '@/lib/utils';

export type FormValues = z.infer<typeof transactionSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountsOptions: { label: string; value: string }[];
  categoriesOptions: { label: string; value: string }[];
  createAccount: (values: { name: string; plaidId?: string }) => Promise<void>;
  createCategories: (values: {
    name: string;
    plaidId?: string;
  }) => Promise<void>;
};

const TransactionsForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountsOptions,
  categoriesOptions,
  createAccount,
  createCategories,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log('handleSubmit called:', values);

    const amount = parseFloat(values.amount);
    const amountMiliunites = convertAmountToMiliunits(amount);

    onSubmit({ ...values, amount: amountMiliunites.toString() });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log('Form onSubmit event fired!');
          form.handleSubmit(handleSubmit)(e);
        }}
        className='space-y-4 px-4'
      >
        <FormField
          name='date'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='accountId'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder='Select an account'
                  options={accountsOptions}
                  onCreate={createAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='categoryId'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder='Select an category'
                  options={categoriesOptions}
                  onCreate={createCategories}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='payee'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder='Add a Payee'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='amount'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder='0.00'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name='notes'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  disabled={disabled}
                  placeholder='Optional notes'
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={disabled}
          type='submit'
          onClick={() => console.log('Button clicked!')}
        >
          {id ? 'Save changes' : 'Create account'}
        </Button>
        {id && (
          <Button
            type='button'
            disabled={disabled}
            onClick={handleDelete}
            className='w-full'
            size='icon'
            variant='outline'
          >
            {' '}
            <Trash className='size-4 mr-2' /> <p>Delete account</p>{' '}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionsForm;
