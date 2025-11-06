import Image from 'next/image';
import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <div>
      <Link href='/'>
        <div className='items-center hidden lg:flex'>
          <Image src='/finance.png' width={32} height={32} alt='logo' />
          <p className='font-bold text-white text-2xl'>Finance</p>
        </div>
      </Link>
    </div>
  );
};

export default HeaderLogo;
