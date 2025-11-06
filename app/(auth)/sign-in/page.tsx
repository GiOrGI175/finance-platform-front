'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInSchema } from '@/lib/schema/signIn.schema';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

type SigninFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleOnSubmit(values: SigninFormData) {
    try {
      setLoading(true);
      console.log('Logging in with:', values);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log('Response:', { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      setAuth(data.token, data.user);

      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl'>
        <CardHeader className='text-center mb-5'>
          <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='email@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='/forgot-password'
                        className='text-sm text-blue-600 hover:underline'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='********'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>

          <CardFooter className='flex items-center justify-center mt-6'>
            <p className='text-sm text-muted-foreground'>
              Don’t have an account?{' '}
              <Link href='/sign-up' className='text-blue-600 hover:underline'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
