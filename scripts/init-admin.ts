import { getPayload, Payload } from 'payload';
import { config } from 'dotenv';
import { CollectionConfig } from 'payload/types';
import { User } from '../src/payload-types';

// Load environment variables
config({ path: '.env.local' });

// This script creates the first admin user if no users exist
async function initAdmin() {
  try {
    console.log('Initializing admin user...');
    
    // Initialize Payload
    const payload = await getPayload({
      // @ts-ignore - This is a workaround for the ESM module issue
      init: {
        local: true,
        onInit: async (payloadInstance: Payload) => {
          // Check if any users exist
          const { totalDocs } = await payloadInstance.find({
            collection: 'users',
            limit: 1,
            depth: 0,
          });

          if (totalDocs === 0) {
            console.log('No users found. Creating admin user...');
            
            // Create admin user
            await payloadInstance.create({
              collection: 'users',
              data: {
                name: 'Admin',
                email: 'admin@nyikasafaris.com',
                password: 'changeme123', // User will be prompted to change this on first login
                roles: ['admin'],
              },
            });
            
            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@nyikasafaris.com');
            console.log('Password: changeme123');
            console.log('\n⚠️  Please change the password after first login!');
          } else {
            console.log('Admin user already exists. Skipping creation.');
          }
        },
      },
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin user:', error);
    process.exit(1);
  }
}

initAdmin();
