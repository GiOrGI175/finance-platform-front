'use client';

import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const UserButton = () => {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.setAuth);

  return (
    <div className='relative w-[120px] flex flex-col items-end'>
      <button onClick={() => setOpen((pv) => !pv)} className='cursor-pointer'>
        <Image src='/user.png' width={32} height={32} alt='user img' />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className='absolute top-full  w-full rounded-lg border  shadow-sm z-10 overflow-hidden bg-white flex items-center justify-center'
          >
            <button className='w-full flex items-center justify-center gap-2 py-2 cursor-pointer'>
              <Image
                src='/logout-svgrepo-com.svg'
                width={24}
                height={24}
                alt='logout'
              />
              <span className='w-fit'>sign-out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserButton;
