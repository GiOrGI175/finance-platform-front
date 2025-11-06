import Header from '@/components/organisms/header/Header';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Dashboardlayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Dashboardlayout;
