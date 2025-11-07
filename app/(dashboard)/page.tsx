'use client';

import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/store/newAccStore';

export default function Home() {
  const setOpen = useNewAccount((state) => state.setOpen);

  return (
    <div>
      <Button onClick={setOpen}>Add new account</Button>
    </div>
  );
}
