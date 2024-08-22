'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '../actions/resetPassword';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const schema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters long'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State to store the token and control rendering
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract the token from the search params
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // If the token is missing, set it to null and alert the user
      setToken(null);
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!token) {
      alert('Invalid or missing token');
      return;
    }

    try {
      await resetPassword(token, data.newPassword);
      alert('Password has been reset successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      alert('Failed to reset password');
    }
  };

  // If the token is missing, display a user-friendly message instead of rendering the form
  if (token === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Invalid or missing token. Please check your reset password link.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full flex flex-col gap-4">
        <Input placeholder="New Password" type="password" {...form.register('newPassword')} />
        <Input placeholder="Confirm Password" type="password" {...form.register('confirmPassword')} />
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    </main>
  );
}
