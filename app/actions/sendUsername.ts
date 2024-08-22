"use server"
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendUsername(email: string) {
  try {
    console.log('sendUsername called with email:', email); // Debug point 1

    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user); // Debug point 2

    if (!user) {
      console.error('No user found with that email'); // Debug point 3
      throw new Error('No user found with that email');
    }

    await resend.emails.send({
      from: 'noreply@authrecover.com',
      to: email,
      subject: 'Username Recovery',
      html: `<p>Your username is: <strong>${user.username}</strong></p>`,
    });
    console.log('Username recovery email sent to:', email); // Debug point 4

    return { success: true };
  } catch (error) {
    console.error('Error in sendUsername:', error); // Debug point 5
    throw new Error('Failed to send username recovery email');
  }
}
