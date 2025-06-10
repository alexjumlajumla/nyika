import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Test query
    const tours = await prisma.tour.findMany({
      take: 1,
    });
    
    console.log('Sample tour:', JSON.stringify(tours[0], null, 2));
    console.log('✅ Successfully queried the database');
    
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .catch((e) => {
    console.error('Unhandled error:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Test completed');
  });
