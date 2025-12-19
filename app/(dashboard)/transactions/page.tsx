'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';

import { columns } from '@/components/molecules/transactions/columns';
import { DataTable } from '@/components/organisms/reusable_table/DataTabel';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountStore } from '@/store/useAccountStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useNewTransaction } from '@/store/newTransactionStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';
import UploadButton from '@/components/atoms/transactions/UploadButton';
import ImportCard from '@/components/molecules/transactions/ImportCard';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_EXPORT = {
  data: [],
  errors: [],
  meta: {},
};

export type AccountRow = {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
};

export type ImportTransactionRow = {
  amount: number;
  date: string;
  payee?: string;
  notes?: string;
};

const TransactionsPage = () => {
  const [variant, setVriants] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_EXPORT);

  const onUpload = (result: typeof INITIAL_IMPORT_EXPORT) => {
    console.log({ result });
    setImportResults(result);
    setVriants(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_EXPORT);
    setVriants(VARIANTS.LIST);
  };

  const bulkCreateTransactions = useTransactionStore(
    (state) => state.bulkCreateTransactions
  );

  const onSubmitImport = async (rows: ImportTransactionRow[]) => {
    try {
      await bulkCreateTransactions(rows);
      setImportResults({ data: [], errors: [], meta: {} });
      setVriants(VARIANTS.LIST);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    }
  };

  const fetchTransactions = useTransactionStore(
    (state) => state.fetchTransactions
  );
  const transactions = useTransactionStore((state) => state.transactions);
  const loading = useTransactionStore((state) => state.loading);
  const deleteTransactions = useTransactionStore(
    (state) => state.deleteTransactions
  );

  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const setOpen = useNewTransaction((state) => state.setOpen);

  // ✅ FIX: სწორი dependency array
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchAccounts(),
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, [fetchTransactions, fetchCategories, fetchAccounts]); // ✅ დამატებულია dependencies

  // Debug log
  useEffect(() => {
    console.log('transactions Data:', transactions);
  }, [transactions]);

  if (loading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
          </CardHeader>
          <CardContent>
            <div className='h-[500px] w-full flex items-center justify-center'>
              <Loader2 className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <ImportCard
        data={importResults.data}
        onCancel={onCancelImport}
        onSubmit={onSubmitImport}
      />
    );
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transactions History
          </CardTitle>
          <div className='sm:flex w-full sm:w-auto items-center gap-y-2 sm:gap-x-2 '>
            <Button
              onClick={() => {
                setOpen();
                fetchAccounts();
                fetchCategories();
              }}
              size='sm'
              className='w-full sm:w-auto'
            >
              <Plus className='size-4 mr-2' />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey='date'
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original._id);
              deleteTransactions(ids);
            }}
            disabled={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
