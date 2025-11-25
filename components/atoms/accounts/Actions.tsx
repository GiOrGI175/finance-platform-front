'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useNewAccount } from '@/store/newAccStore';
import { useNewCategories } from '@/store/newCtgStore';
import { usePathname } from 'next/navigation';
import { useNewTransaction } from '@/store/newTransactionStore';

type Props = {
  id: string;
};

const Actions = ({ id }: Props) => {
  const pathname = usePathname() || '';

  const setOpenAccountEdit = useNewAccount((state) => state.setOpenEdit);
  const setOpenCategoryEdit = useNewCategories((state) => state.setOpenEdit);
  const setTransactionsEdit = useNewTransaction((state) => state.setOpenEdit);

  const handleEdit = () => {
    if (pathname.includes('/accounts')) {
      setOpenAccountEdit(id);
    } else if (pathname.includes('/categories')) {
      setOpenCategoryEdit(id);
    } else if (pathname.includes('/transactions')) {
      setTransactionsEdit(id);
    } else {
      console.warn('⚠️ Unknown pathname in Actions:', pathname);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 p-0 hover:bg-muted/60 transition'
        >
          <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-40 rounded-md border border-border bg-white shadow-md'
      >
        <DropdownMenuItem onClick={handleEdit} className='p-2 flex'>
          <Edit className='size-5 mr-2' /> Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
