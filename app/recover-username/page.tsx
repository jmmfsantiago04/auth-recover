'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendUsername } from '../actions/sendUsername';

// Define the schema using Zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

export default function RecoverUsername() {
  // Use the inferred type in useForm
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Use the inferred type in handleSubmit
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await sendUsername(data.email);
      alert('Your username has been sent to your email');
    } catch (error) {
      console.error(error);
      alert('Failed to send username recovery email');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full flex flex-col gap-4">
        <Input placeholder="Email" {...form.register('email')} />
        <Button type="submit" className="w-full">Recover Username</Button>
      </form>
    </main>
  );
}
