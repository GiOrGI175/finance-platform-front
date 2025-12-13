import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/ui/amount-input';
import { useEffect } from 'react';

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

  // ✅ Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      console.log('Resetting form with defaultValues:', defaultValues);
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = (values: FormValues) => {
    console.log('handleSubmit called:', values);
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  console.log('Current form values:', form.watch());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split('T')[0]
                      : '';
                    field.onChange(formattedDate);
                  }}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='accountId'
          control={form.control}
          render={({ field }) => {
            console.log('accountId field:', field.value);
            return (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger className='w-full h-10 px-3 text-sm'>
                      <SelectValue placeholder='Select an account' />
                    </SelectTrigger>
                    <SelectContent>
                      {accountsOptions.map((acc) => (
                        <SelectItem key={acc.value} value={acc.value}>
                          {acc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <FormField
          name='categoryId'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Category</FormLabel>
              <FormControl className='w-full'>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className='w-full h-10 px-3 text-sm'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  value={field.value || ''}
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
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
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
        <Button className='w-full' disabled={disabled} type='submit'>
          {id ? 'Save changes' : 'Create Transaction'}
        </Button>
        {id && (
          <Button
            type='button'
            disabled={disabled}
            onClick={handleDelete}
            className='w-full'
            variant='outline'
          >
            <Trash className='size-4 mr-2' />
            <span>Delete Transaction</span>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionsForm;
