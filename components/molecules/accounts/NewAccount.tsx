'use client';

import { useNewAccount } from '@/store/newAccStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import AccountForm, { FormValues } from './AccountForm';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';

const NewAccount = ({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues?: FormValues;
}) => {
  const isOpen = useNewAccount((state) => state.isOpen);
  const setClose = useNewAccount((state) => state.setClose);
  const createAccount = useAccountStore((state) => state.createAccount);
  const createLoading = useAccountStore((state) => state.createLoading);

  const onSubmit = async (values: { name: string; plaidId?: string }) => {
    await createAccount(values);
    setClose();
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete account');
      toast.success('Account deleted!');
      setClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>{id ? 'Edit Account' : 'New Account'}</SheetTitle>
          <SheetDescription>
            {id
              ? 'Update your existing account details'
              : 'Create new account to track your transactions'}
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          id={id}
          onSubmit={onSubmit}
          onDelete={handleDelete}
          disabled={createLoading}
          defaultValues={defaultValues || { name: '', plaidId: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccount;
