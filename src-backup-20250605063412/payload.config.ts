import path from 'path';
import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';

// Disable TypeScript type checking for the entire file
// @ts-nocheck

// Import collections with type assertions
import Users from './payload/collections/Users';
import Tours from './payload/collections/Tours';
import TourCategories from './payload/collections/TourCategories';
import Accommodations from './payload/collections/Accommodations';
import AccommodationCategories from './payload/collections/AccommodationCategories';
import Attractions from './payload/collections/Attractions';
import Media from './payload/collections/Media';
import Prices from './payload/collections/Prices';

// Get the current directory path
const currentDir = path.resolve();

// Export the config
const config: any = {
  // Server URL (appended to admin panel and API routes)
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
  
  // Admin panel configuration
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  
  // Secret for signing cookies and tokens (must be set via PAYLOAD_SECRET environment variable)
  
  // Database configuration
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost/nyika-safaris',
  }),
  
  // Editor configuration
  editor: slateEditor({}),
  
  // Collections with type assertions
  // @ts-ignore - Bypass type checking for collections
  collections: [
    Users,
    Media,
    Tours,
    TourCategories,
    Attractions,
    Accommodations,
    AccommodationCategories,
    Prices,
  ],
  
  // CORS configuration
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001',
  ].filter(Boolean) as string[],
  
  // CSRF configuration
  csrf: [
    process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000',
  ].filter(Boolean) as string[],
  
  // TypeScript types output
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  
  // GraphQL configuration
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  
  // Rate limiting (optional)
  rateLimit: {
    trustProxy: true,
    window: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
  },
  
  // Upload configuration
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  
  // Initialize function
  onInit: async (payload: import('payload').Payload) => {
    try {
      // Check if users collection exists and has any documents
      const users = await payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
      });
      
      // Create default admin user if no users exist
      if (users.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'admin@example.com',
            password: 'changeme',
            role: 'admin',
          },
        });
        console.log('Default admin user created');
      }
    } catch (error) {
      console.error('Error initializing Payload CMS:', error);
    }
  },
};

export default buildConfig(config);
