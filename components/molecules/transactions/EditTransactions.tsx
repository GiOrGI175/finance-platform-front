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

  const currentTransaction = useMemo(
    () => transactions.find((transactions) => transactions._id === id),
    [transactions, id]
  );

  console.log('currentTransaction:', currentTransaction);

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

    const values = {
      date: currentTransaction.date
        ? new Date(currentTransaction.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      accountId: currentTransaction.accountId?._id || '',
      categoryId: currentTransaction.categoryId?._id || '',
      payee: currentTransaction.payee || '',
      amount: currentTransaction.amount?.toString() || '',
      notes: currentTransaction.notes || '',
    };

    console.log('Default Values:', values);
    return values;
  }, [currentTransaction]);

  useEffect(() => {
    if (currentTransaction && isOpenEdit) {
      console.log('Resetting form with transaction:', currentTransaction);
    }
  }, [currentTransaction, isOpenEdit]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) return toast.error('Missing transaction ID');

      console.log('Submitting values:', values);

      const payload = {
        date: values.date,
        accountId: values.accountId,
        categoryId: values.categoryId,
        payee: values.payee,
        amount: values.amount,
        notes: values.notes,
      };

      console.log('Sending payload:', payload);

      await updateTransaction(id, payload);

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
