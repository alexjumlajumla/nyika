import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('User already exists, updating password...');
    await prisma.user.update({
      where: { email },
      data: {
        hashedPassword,
        emailVerified: new Date(),
      },
    });
    console.log('User password updated successfully');
    return;
  }

  // Create new user if doesn't exist
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Test User',
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log('Test user created successfully:', user);
}

createTestUser()
  .catch((e) => {
    console.error('Error creating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
