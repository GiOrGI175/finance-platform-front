'use client';

import NewAccount from '@/components/molecules/accounts/NewAccount';
import { useMountedState } from 'react-use';

const NewAccountProvaider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccount />
    </>
  );
};

export default NewAccountProvaider;
