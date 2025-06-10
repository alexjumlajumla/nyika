import { PrismaClient } from '@prisma/client';
type Role = 'USER' | 'ADMIN' | 'GUIDE' | 'STAFF';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'password123';
  const name = 'Test User';
  
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User with email ${email} already exists.`);
    return;
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);

  // Create the user using Prisma's create method
  await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      emailVerified: new Date(),
      role: 'USER' as const,
    },
  });

  // Fetch the created user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Failed to create user');
  }

  console.log(`Created test user with ID: ${user.id}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
