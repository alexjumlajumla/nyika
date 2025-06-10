import { prisma } from '@/lib/db/prisma';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function testRegistration() {
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(testUser.password, 12);

    // Create user with raw query to handle field mapping
    const currentDate = new Date();
    const userId = randomUUID();
    const newUsers = await prisma.$queryRaw<Array<{ 
      id: string;
      name: string | null;
      email: string;
      role: string;
      created_at: string;
      updated_at: string;
    }>>`
      INSERT INTO users (id, name, email, hashed_password, role, created_at, updated_at)
      VALUES (
        ${userId},
        ${testUser.name}, 
        ${testUser.email}, 
        ${hashedPassword}, 
        'USER',
        ${currentDate.toISOString()},
        ${currentDate.toISOString()}
      )
      RETURNING id, name, email, role, created_at, updated_at
    `;

    const user = newUsers[0];
    console.log('Test user created successfully:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });

    // Verify the user can be retrieved
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log('\nUser retrieved from database:');
    console.log(foundUser);

    // Clean up
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log('\nTest user deleted successfully');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
