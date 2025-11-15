'use client';

import { useNewAccount } from '@/store/newAccStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import CategoriesForm, { FormValues } from './CategoriesForm';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';
import { useNewCategories } from '@/store/newCtgStore';

const NewCategories = ({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues?: FormValues;
}) => {
  const isOpen = useNewCategories((state) => state.isOpen);
  const setClose = useNewCategories((state) => state.setClose);

  const createCategories = useCategoriesStore(
    (state) => state.createCategories
  );
  const createLoading = useCategoriesStore((state) => state.createLoading);

  const onSubmit = async (values: { name: string; plaidId?: string }) => {
    await createCategories(values);
    setClose();
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/Categories/${id}`, {
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
          <SheetTitle>{id ? 'Edit Category' : 'New Category'}</SheetTitle>
          <SheetDescription>
            {id
              ? 'Update your existing account details'
              : 'Create new account to track your transactions'}
          </SheetDescription>
        </SheetHeader>

        <CategoriesForm
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

export default NewCategories;
