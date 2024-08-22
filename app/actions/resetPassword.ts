"use server"
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function resetPassword(token: string, newPassword: string) {
  try {
    console.log('resetPassword called with token:', token); // Debug point 1

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });
    console.log('User found:', user); // Debug point 2

    if (!user) {
      console.error('Invalid or expired password reset token'); // Debug point 3
      throw new Error('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New password hashed:', hashedPassword); // Debug point 4

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    console.log('User password updated successfully for user ID:', user.id); // Debug point 5

    return { success: true };
  } catch (error) {
    console.error('Error in resetPassword:', error); // Debug point 6
    throw new Error('Failed to reset password');
  }
}
