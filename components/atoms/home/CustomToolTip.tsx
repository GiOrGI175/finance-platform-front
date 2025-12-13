import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function CustomToolTip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const row = payload[0].payload;
  const income = row.income;
  const expenses = row.expenses;

  return (
    <div className='rounded-sm bg-white shadow-sm border overflow-hidden'>
      <div className='text-sm p-2 px-3 bg-muted text-muted-foreground'>
        {format(new Date(row.date), 'MMM dd, yyyy')}
      </div>
      <Separator />
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='size-1.5 bg-blue-500 rounded-full' />
            <span className='text-sm text-muted-foreground'>Income</span>
          </div>
          <span className='text-sm font-medium'>{formatCurrency(income)}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='size-1.5 bg-rose-500 rounded-full' />
            <span className='text-sm text-muted-foreground'>Expenses</span>
          </div>
          <span className='text-sm font-medium'>
            {formatCurrency(expenses * -1)}
          </span>
        </div>
      </div>
    </div>
  );
}
