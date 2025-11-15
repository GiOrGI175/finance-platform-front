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
import { categoriesSchema } from '@/lib/schema/categories.shcema';

export type FormValues = z.infer<typeof categoriesSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const CategoriesForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log('handleSubmit called:', values);
    onSubmit(values);
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
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder='e.g Cash, Bank, Credit Card'
                  {...field}
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

export default CategoriesForm;
