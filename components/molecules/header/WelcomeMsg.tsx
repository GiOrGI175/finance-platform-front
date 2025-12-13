import { useAuthStore } from '@/store/authStore';

const WelcomeMsg = () => {
  const user = useAuthStore((state) => state.user);

  console.log(user);

  return (
    <div className='space-y-2 mb-4'>
      <h2 className='text-2xl lg:text-4xl text-white font-medium'>
        Welcome Back {user?.username}
      </h2>
      <p className='text-sm lg:text-base text-[#89b6fd]'>
        This is your Financial Overview Report
      </p>
    </div>
  );
};

export default WelcomeMsg;
