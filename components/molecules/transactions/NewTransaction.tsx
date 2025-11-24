'use client';

import { useNewAccount } from '@/store/newAccStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import TransactionsForm, { FormValues } from './TransactionsForm';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useNewTransaction } from '@/store/newTransactionStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';

const NewTransaction = ({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues?: FormValues;
}) => {
  const isOpen = useNewTransaction((state) => state.isOpen);
  const setClose = useNewTransaction((state) => state.setClose);

  const createTransaction = useTransactionStore(
    (state) => state.createTransaction
  );
  const createLoading = useTransactionStore((state) => state.createLoading);

  const createAccount = useAccountStore((state) => state.createAccount);
  const accounts = useAccountStore((state) => state.accounts);

  console.log(accounts);

  const accountsOptions = accounts.map((acc) => ({
    label: acc.name,
    value: acc._id,
  }));

  console.log(accountsOptions);

  const createCategories = useCategoriesStore(
    (state) => state.createCategories
  );
  const categories = useCategoriesStore((state) => state.categories);
  const categoriesOptions = categories.map((ctg) => ({
    label: ctg.name,
    value: ctg._id,
  }));

  const onSubmit = async (values: FormValues) => {
    await createTransaction(values);
    setClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>{id ? 'Edit Transaction' : 'New Transaction'}</SheetTitle>
          <SheetDescription>Add A new Transaction</SheetDescription>
        </SheetHeader>
        <TransactionsForm
          onSubmit={onSubmit}
          disabled={createLoading}
          createAccount={createAccount}
          accountsOptions={accountsOptions}
          createCategories={createCategories}
          categoriesOptions={categoriesOptions}
          defaultValues={{
            date: '',
            accountId: '',
            categoryId: '',
            payee: '',
            amount: '',
            notes: '',
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewTransaction;
