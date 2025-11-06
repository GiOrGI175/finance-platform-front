import Image from 'next/image';
import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <div>
      <Link href='/'>
        <div className='items-center hidden lg:flex'>
          <Image src='/finance.png' width={28} height={28} alt='logo' />
          <p className='font-bold text-white text-2xl ml-2.5'>Finance</p>
        </div>
      </Link>
    </div>
  );
};

export default headerLogo;
