'use client';

import Header from '@/components/organisms/header/Header';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          router.replace('/sign-in');
          return;
        }

        setIsAuthorized(true);
      } catch {
        router.replace('/sign-in');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='size-10 animate-spin text-slate-300' />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <>
      <Header />
      <main className='px-4 py-8 lg:px-14'>{children}</main>
    </>
  );
};

export default DashboardLayout;
