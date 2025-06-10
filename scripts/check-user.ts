import { prisma } from '../src/lib/db';

async function checkTestUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
    select: { id: true, email: true, role: true, hashedPassword: true }
  });
  console.log('Test user:', user);
  await prisma.$disconnect();
}

checkTestUser().catch(console.error);
