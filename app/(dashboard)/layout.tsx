'use client';

import Header from '@/components/organisms/header/Header';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        console.log('Auth check response:', res.status);

        if (res.status === 401 || res.status === 403) {
          router.replace('/sign-in');
          return;
        }

        if (!res.ok) {
          router.replace('/sign-in');
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.replace('/sign-in');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className='flex items-center justify-center h-screen text-gray-500'>
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className='px-4 py-8 lg:px-14'>{children}</main>
    </>
  );
};

export default DashboardLayout;
