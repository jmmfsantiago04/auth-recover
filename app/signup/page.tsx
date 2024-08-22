'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerAction } from "../actions/register";

const formSchema = z.object({
  username: z.string().min(5, 'Username should be at least 5 characters long').max(15, 'Username should be less than 15 characters long'),
  emailAddress: z.string().email('Invalid email address'),
  nameFull: z.string().optional(),
  password: z.string().min(8, 'Password should be at least 8 characters long').max(20, 'Password should be less than 20 characters long').regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(8, 'Password should be at least 8 characters long').max(20, 'Password should be less than 20 characters long').regex(/\d/, 'Password must contain at least one number'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      emailAddress: "",
      nameFull: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerAction(values);
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameFull"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <p className="mt-4 text-center">
            Already have an account? <Link href="/auth/login" className="text-blue-500">Login</Link>
          </p>
        </form>
      </Form>
    </main>
  );
}
