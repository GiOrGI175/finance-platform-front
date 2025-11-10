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
import { useCategoriesStore } from '@/store/useCaregoriesStore';
import { useNewCategories } from '@/store/newCtgStore';

export type AccountRow = {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
};

const CategoriesPage = () => {
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const categories = useCategoriesStore((state) => state.categories);
  const loading = useCategoriesStore((state) => state.loading);
  const deleteCategories = useCategoriesStore(
    (state) => state.deleteCategories
  );

  const setOpen = useNewCategories((state) => state.setOpen);

  useEffect(() => {
    fetchCategories();
  }, []);

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
            onClick={() => setOpen()}
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
            data={categories}
            onDelete={(row) => {
              const ids = row.map((r) => r.original._id);
              deleteCategories(ids);
            }}
            disabled={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
