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

  console.log(currentTransaction, 'currentTransaction');

  const createAccount = useAccountStore((state) => state.createAccount);
  const accounts = useAccountStore((state) => state.accounts);
  const accountsOptions = accounts.map((acc) => ({
    label: acc.name,
    value: acc._id,
  }));

  const createCategories = useCategoriesStore(
    (state) => state.createCategories
  );
  const categories = useCategoriesStore((state) => state.categories);
  const categoriesOptions = categories.map((ctg) => ({
    label: ctg.name,
    value: ctg._id,
  }));

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) return toast.error('Missing account ID');

      await updateTransaction(id, {
        ...values,
        amount: parseFloat(values.amount),
        accountId: { _id: values.accountId, name: '' },
        categoryId: { _id: values.categoryId, name: '' },
      });
      toast.success('Account updated successfully!');
      setCloseEdit();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteTransactions([id]);
    setCloseEdit();
  };

  useEffect(() => {}, []);

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
          defaultValues={{
            date: new Date().toISOString().split('T')[0],
            accountId: currentTransaction?.accountId.name || '',
            categoryId: currentTransaction?.categoryId.name || '',
            payee: currentTransaction?.payee || '',
            amount: currentTransaction?.amount?.toString() || '',
            notes: currentTransaction?.notes || '',
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactions;
