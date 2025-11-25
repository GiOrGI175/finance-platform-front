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
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';
import { useNewCategories } from '@/store/newCtgStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';
import { useNewTransaction } from '@/store/newTransactionStore';
import { useTransactionStore } from '@/store/useTransactionStore';

const EditTransactions = () => {
  const isOpenEdit = useNewTransaction((state) => state.isOpenEdit);
  const setCloseEdit = useNewTransaction((state) => state.setCloseEdit);
  const id = useNewTransaction((state) => state.id);

  const createLoading = useTransactionStore((state) => state.createLoading);
  const deleteTransactions = useTransactionStore(
    (state) => state.deleteTransactions
  );
  const transactions = useTransactionStore((state) => state.transactions);
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  );

  console.log('Transactions in edit:', transactions);
  console.log('Current ID:', id);

  const currentTransaction = useMemo(
    () => transactions.find((acc) => acc._id === id),
    [transactions, id]
  );

  console.log('Current Transaction:', currentTransaction);

  const createAccount = useAccountStore((state) => state.createAccount);
  const accounts = useAccountStore((state) => state.accounts);

  const accountsOptions = useMemo(
    () =>
      accounts.map((acc) => ({
        label: acc.name,
        value: acc._id,
      })),
    [accounts]
  );

  const createCategories = useCategoriesStore(
    (state) => state.createCategories
  );
  const categories = useCategoriesStore((state) => state.categories);

  const categoriesOptions = useMemo(
    () =>
      categories.map((ctg) => ({
        label: ctg.name,
        value: ctg._id,
      })),
    [categories]
  );

  // Default values with proper fallbacks
  const defaultValues = useMemo(() => {
    if (!currentTransaction) {
      return {
        date: new Date().toISOString().split('T')[0],
        accountId: '',
        categoryId: '',
        payee: '',
        amount: '',
        notes: '',
      };
    }

    return {
      date: currentTransaction.date || new Date().toISOString().split('T')[0],
      accountId: currentTransaction.accountId?._id || '',
      categoryId: currentTransaction.categoryId?._id || '',
      payee: currentTransaction.payee || '',
      amount: currentTransaction.amount?.toString() || '',
      notes: currentTransaction.notes || '',
    };
  }, [currentTransaction]);

  console.log('Default Values:', defaultValues);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) return toast.error('Missing transaction ID');

      await updateTransaction(id, {
        ...values,
        amount: parseFloat(values.amount),
        accountId: { _id: values.accountId, name: '' },
        categoryId: { _id: values.categoryId, name: '' },
      });
      toast.success('Transaction updated successfully!');
      setCloseEdit();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteTransactions([id]);
    setCloseEdit();
  };

  // Don't render form until we have the transaction data
  if (!currentTransaction) {
    return (
      <Sheet open={isOpenEdit} onOpenChange={setCloseEdit}>
        <SheetContent className='space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Loading transaction data...</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpenEdit} onOpenChange={setCloseEdit}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update your existing Transaction details
          </SheetDescription>
        </SheetHeader>

        <TransactionsForm
          id={id}
          onSubmit={onSubmit}
          onDelete={handleDelete}
          disabled={createLoading}
          createAccount={createAccount}
          accountsOptions={accountsOptions}
          createCategories={createCategories}
          categoriesOptions={categoriesOptions}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactions;
