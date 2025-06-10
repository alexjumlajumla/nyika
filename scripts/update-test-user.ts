import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function updateTestUser() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      hashedPassword,
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      hashedPassword,
      role: 'USER',
    },
  });

  console.log('Test user updated:', {
    id: user.id,
    email: user.email,
    role: user.role,
    hashedPassword: user.hashedPassword ? '***' : 'none'
  });
  
  await prisma.$disconnect();
}

updateTestUser().catch(console.error);
