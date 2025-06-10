import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const email = 'admin@nyikasafaris.com';
  const newPassword = 'Admin@1234'; // You can change this to a more secure password
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { email },
        data: {
          hashedPassword: hashedPassword,
          role: Role.ADMIN,
        },
      });
    } else {
      // Create new admin user
      await prisma.user.create({
        data: {
          email,
          name: 'Admin User',
          hashedPassword: hashedPassword,
          role: Role.ADMIN,
          emailVerified: new Date(),
        },
      });
    }

    console.log('✅ Admin credentials have been reset successfully!');
    console.log('----------------------------------------');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('----------------------------------------');
    console.log('⚠️  Please change this password after logging in!');
    console.log('🔗 Login URL: http://localhost:3000/auth/signin');
  } catch (error) {
    console.error('❌ Error resetting admin password:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
