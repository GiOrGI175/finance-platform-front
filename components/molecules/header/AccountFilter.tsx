'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import qs from 'query-string';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAccountStore } from '@/store/useAccountStore';
import { useEffect } from 'react';
import { useSummaryStore } from '@/store/useSummaryStore';

export default function AccountFilter() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get('accountId') || 'all';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const accounts = useAccountStore((state) => state.accounts);
  const createLoading = useAccountStore((state) => state.createLoading);

  const fetchSummary = useSummaryStore((state) => state.fetchSummary);
  const loading = useSummaryStore((state) => state.loading);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === 'all') {
      query.accountId = '';
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
    fetchSummary(query);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={createLoading || loading}
    >
      <SelectTrigger className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition'>
        <SelectValue placeholder='Select account' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All accounts</SelectItem>
        {accounts?.map((acc) => (
          <SelectItem key={acc._id} value={acc._id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
