import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import ImportTable from './ImportTable';
import { format, parse } from 'date-fns';
import { useAccountStore } from '@/store/useAccountStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';
const requiredOptions = ['amount', 'date', 'payee'];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export default function ImportCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColums, setSelectedColums] = useState<SelectedColumnsState>(
    {}
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, []);

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColums((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColums).filter(Boolean).length;

  const handleContinue = () => {
    if (!selectedAccountId || !selectedCategoryId) {
      toast.error('Please select both Account and Category');
      return;
    }

    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColums[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColums[`column_${columnIndex}`] ? cell : null;
          });

          return transformRow.every((item) => item === null)
            ? []
            : transformRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    console.log('Array of data before formatting:', arrayOfData);

    const formattedData = arrayOfData
      .map((item) => {
        try {
          const parsedDate = parse(item.date, dateFormat, new Date());
          const formattedDate = format(parsedDate, outputFormat);

          return {
            amount: item.amount,
            payee: item.payee || '',
            notes: item.notes || '',
            date: formattedDate,
            accountId: selectedAccountId,
            categoryId: selectedCategoryId,
          };
        } catch (error) {
          console.error('Date parsing error for item:', item, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from date parsing errors

    console.log('Formatted data to submit:', formattedData);
    console.log('Number of transactions:', formattedData.length);

    onSubmit(formattedData);
  };

  const canContinue =
    progress >= requiredOptions.length &&
    selectedAccountId &&
    selectedCategoryId;

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Import Transactions ({body.length} rows)
          </CardTitle>
          <div className='flex flex-col sm:flex-row w-full sm:w-auto items-center gap-y-2 sm:gap-x-2'>
            <Button onClick={onCancel} size='sm' className='w-full sm:w-auto'>
              Cancel
            </Button>
            <Button
              disabled={!canContinue}
              onClick={handleContinue}
              size='sm'
              className='w-full sm:w-auto'
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg'>
            <div className='space-y-2'>
              <Label htmlFor='account-select'>Select Account *</Label>
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger id='account-select'>
                  <SelectValue placeholder='Choose account' />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length === 0 ? (
                    <div className='p-2 text-sm text-muted-foreground'>
                      No accounts found
                    </div>
                  ) : (
                    accounts.map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        {account.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category-select'>Select Category *</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger id='category-select'>
                  <SelectValue placeholder='Choose category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className='p-2 text-sm text-muted-foreground'>
                      No categories found
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ImportTable
            headers={headers}
            body={body}
            selectedColums={selectedColums}
            ontableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
