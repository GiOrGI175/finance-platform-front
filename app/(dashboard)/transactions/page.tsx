'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';

import { columns } from '@/components/molecules/reusable_table/columns';
import { DataTable } from '@/components/organisms/reusable_table/DataTabel';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNewAccount } from '@/store/newAccStore';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountStore } from '@/store/useAccountStore';
import { useNewCategories } from '@/store/newCtgStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useNewTransaction } from '@/store/newTransactionStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';

export type AccountRow = {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
};

const TransactionsPage = () => {
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log('🧾 Categories Data:', transactions);
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

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Caregories page
          </CardTitle>
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
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey='name'
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
