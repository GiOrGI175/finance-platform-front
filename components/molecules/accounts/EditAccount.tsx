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
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';

const EditAccount = () => {
  const isOpenEdit = useNewAccount((state) => state.isOpenEdit);
  const setCloseEdit = useNewAccount((state) => state.setCloseEdit);
  const id = useNewAccount((state) => state.id);

  const createAccount = useAccountStore((state) => state.createAccount);
  const createLoading = useAccountStore((state) => state.createLoading);
  const deleteAccounts = useAccountStore((state) => state.deleteAccounts);
  const accounts = useAccountStore((state) => state.accounts);
  const updateAccount = useAccountStore((state) => state.updateAccount);

  const currentAccount = useMemo(
    () => accounts.find((acc) => acc._id === id),
    [accounts, id]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) return toast.error('Missing account ID');

      await updateAccount(id, values);
      toast.success('Account updated successfully!');
      setCloseEdit();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteAccounts([id]);
    setCloseEdit();
  };

  useEffect(() => {}, []);

  return (
    <Sheet open={isOpenEdit} onOpenChange={setCloseEdit}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Update your existing account details
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          id={id}
          onSubmit={onSubmit}
          onDelete={handleDelete}
          disabled={createLoading}
          defaultValues={{
            name: currentAccount?.name || '',
            plaidId: currentAccount?.plaidId || '',
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditAccount;
