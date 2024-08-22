'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendPasswordReset } from '@/app/actions/sendPasswordReset';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function RequestPasswordReset() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting email for password reset:", data.email);
      await sendPasswordReset(data.email);
      setIsSubmitted(true);
      alert('Password reset link has been sent to your email');
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert('Failed to send password reset email. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!isSubmitted ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full flex flex-col gap-4">
          <Input 
            placeholder="Email" 
            {...form.register('email')} 
            disabled={isSubmitting} 
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <p>A password reset link has been sent to your email. Please check your inbox.</p>
      )}
    </main>
  );
}
