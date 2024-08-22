import { randomBytes } from 'crypto';
import { promisify } from 'util';

const randomBytesAsync = promisify(randomBytes);

export async function generateToken() {
  const buffer = await randomBytesAsync(32);
  return buffer.toString('hex');
}
