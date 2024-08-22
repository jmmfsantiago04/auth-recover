"use server"
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const parsedData = loginSchema.parse(data);
  const { email, password } = parsedData;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  return { success: true, user };
}
