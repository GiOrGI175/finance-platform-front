import AccountFilter from '@/components/molecules/header/AccountFilter';
import DataFilter from './DataFilter';

export default function Filters() {
  return (
    <div className='flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      <AccountFilter />
      <DataFilter />
    </div>
  );
}
