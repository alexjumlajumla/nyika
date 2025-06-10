const { buildConfig } = require('payload/config');
const { webpackBundler } = require('@payloadcms/bundler-webpack');
const { mongooseAdapter } = require('@payloadcms/db-mongodb');
const { cloudStorage } = require('@payloadcms/plugin-cloud-storage');
const { cloudinaryStorage } = require('@payloadcms/plugin-cloud-storage/cloudinary');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Import types for better type safety
/** @type {import('payload/types').Config} */

// Import collections
const Users = require('./collections/Users.js');
const Tours = require('./collections/Tours.js');
const TourCategories = require('./collections/TourCategories.js');
const Accommodations = require('./collections/Accommodations.js');
const AccommodationCategories = require('./collections/AccommodationCategories.js');
const Attractions = require('./collections/Attractions.js');
const Prices = require('./collections/Prices.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const config = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    process.env.PAYLOAD_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost/nyika-safaris',
  }),
  plugins: [
    cloudStorage({
      collections: {
        'tours': {
          adapter: cloudinaryStorage({ cloudinary }),
          disablePayloadAccessControl: true,
        },
        'accommodations': {
          adapter: cloudinaryStorage({ cloudinary }),
          disablePayloadAccessControl: true,
        },
        'attractions': {
          adapter: cloudinaryStorage({ cloudinary }),
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
  collections: [
    Users,
    Tours,
    TourCategories,
    Accommodations,
    AccommodationCategories,
    Attractions,
    Prices,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});

module.exports = config;
