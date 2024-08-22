"use server"
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(5).max(15),
  emailAddress: z.string().email(),
  nameFull: z.string().optional(),
  password: z.string().min(8).max(20).regex(/\d/),
  confirmPassword: z.string().min(8).max(20).regex(/\d/),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export async function registerAction(data: z.infer<typeof registerSchema>) {
  const parsedData = registerSchema.parse(data);
  const { username, emailAddress, nameFull, password } = parsedData;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email: emailAddress,
        nameFull,
        password: hashedPassword,
      },
    });
    return { success: true, user };
  } catch (error) {
    throw new Error('User registration failed');
  }
}
