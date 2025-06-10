import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function verifyPassword() {
  const email = 'test@example.com';
  const password = 'password123';
  
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, hashedPassword: true }
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    console.log('User found:', { email: user.email });
    
    if (!user.hashedPassword) {
      console.error('User has no password set');
      return;
    }

    // Verify the password
    const isValid = await bcrypt.compare(password, user.hashedPassword);
    console.log('Password verification result:', isValid);
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(password, 12);
    console.log('New hash for comparison:', newHash);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPassword();
