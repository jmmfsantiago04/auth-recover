"use server"
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/token';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordReset(email: string) {
  try {
    console.log('sendPasswordReset called with email:', email); // Debug point 1

    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user); // Debug point 2

    if (!user) {
      console.error('No user found with that email'); // Debug point 3
      throw new Error('No user found with that email');
    }

    const token = await generateToken();
    console.log('Generated token:', token); // Debug point 4

    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour
    console.log('Token expiration time set to:', expires); // Debug point 5

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });
    console.log('User record updated with reset token and expiration'); // Debug point 6

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    console.log('Generated reset link:', resetLink); // Debug point 7

    await resend.emails.send({
      from: 'noreply@authrecover.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>
             <p>This link will expire in 1 hour.</p>`,
    });
    console.log('Password reset email sent to:', email); // Debug point 8

    return { success: true };
  } catch (error) {
    console.error('Error in sendPasswordReset:', error); // Debug point 9
    throw new Error('Failed to send password reset email');
  }
}
