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

const NewAccount = ({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues?: FormValues;
}) => {
  const isOpen = useNewAccount((state) => state.isOpen);
  const setClose = useNewAccount((state) => state.setClose);

  const [loading, setLoading] = useState(false);

  const token = useAuthStore((state) => state.token);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const url = id ? `/api/accounts/${id}` : '/api/accounts';
      const method = id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Request failed');

      toast.success(id ? 'Account updated!' : 'Account created!');
      setClose();
    } catch (error: any) {
      console.error('Account request error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setLoading(true);

      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');
      toast.success('Account deleted!');
      setClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
          disabled={loading}
          defaultValues={defaultValues || { name: '', plaidId: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccount;
