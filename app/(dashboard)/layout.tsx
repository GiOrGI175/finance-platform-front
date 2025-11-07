import Header from '@/components/organisms/header/Header';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Dashboardlayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className='px-4 py-8 lg:px-14 '>{children}</main>
    </>
  );
};

export default Dashboardlayout;
