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
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAccountStore } from '@/store/useAccountStore';
import { useNewCategories } from '@/store/newCtgStore';
import { useCategoriesStore } from '@/store/useCaregoriesStore';

const EditCategories = () => {
  const isOpenEdit = useNewCategories((state) => state.isOpenEdit);
  const setCloseEdit = useNewCategories((state) => state.setCloseEdit);
  const id = useNewCategories((state) => state.id);

  const createLoading = useCategoriesStore((state) => state.createLoading);
  const deleteCategories = useCategoriesStore(
    (state) => state.deleteCategories
  );
  const categories = useCategoriesStore((state) => state.categories);
  const updateCategories = useCategoriesStore(
    (state) => state.updateCategories
  );

  const currentAccount = useMemo(
    () => categories.find((acc) => acc._id === id),
    [categories, id]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) return toast.error('Missing account ID');

      await updateCategories(id, values);
      toast.success('Account updated successfully!');
      setCloseEdit();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteCategories([id]);
    setCloseEdit();
  };

  useEffect(() => {}, []);

  return (
    <Sheet open={isOpenEdit} onOpenChange={setCloseEdit}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Update your existing Category details
          </SheetDescription>
        </SheetHeader>

        <CategoriesForm
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

export default EditCategories;
