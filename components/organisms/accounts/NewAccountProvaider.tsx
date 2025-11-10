'use client';

import EditAccount from '@/components/molecules/accounts/EditAccount';
import NewAccount from '@/components/molecules/accounts/NewAccount';
import { useMountedState } from 'react-use';

const NewAccountProvaider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccount />
      <EditAccount />
    </>
  );
};

export default NewAccountProvaider;
