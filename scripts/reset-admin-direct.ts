import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const email = 'admin@nyikasafaris.com';
  const newPassword = 'Admin@1234'; // You can change this to a more secure password
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Check if user exists and update or create
    try {
      // Try to update existing user first
      const updateResult = await prisma.$executeRaw`
        UPDATE users 
        SET 
          hashed_password = ${hashedPassword},
          role = 'ADMIN',
          updated_at = NOW()
        WHERE email = ${email}
        RETURNING id;
      `;
      
      // If no rows were updated, insert new user
      if (updateResult === 0) {
        await prisma.$executeRaw`
          INSERT INTO users (id, email, name, hashed_password, role, email_verified, created_at, updated_at)
          VALUES (gen_random_uuid(), ${email}, 'Admin User', ${hashedPassword}, 'ADMIN', NOW(), NOW(), NOW());
        `;
      }
    } catch (error) {
      console.error('❌ Error during user update/creation:');
      console.error(error);
      throw error; // Re-throw to be caught by the outer try-catch
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
