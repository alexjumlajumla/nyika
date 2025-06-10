import path from 'path';
import { generateTypes } from 'payload/generate-types';
import payloadConfig from './payload.config.cjs';

// Create a proper config object with all required properties
const config: Config = {
  ...payloadConfig,
  // Ensure all required config properties are set
  admin: {
    ...payloadConfig.admin,
    // Add any required admin config here
  },
  collections: payloadConfig.collections || [],
  // Add any other required config properties
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
};

const generate = async () => {
  try {
    console.log('Generating Payload types...');
    // Generate types using the config
    await generateTypes({
      config: config as any, // Type assertion to avoid type errors
      outputFile: path.resolve(__dirname, '../payload-types.ts'),
    });
    console.log('Successfully generated Payload types!');
  } catch (error) {
    console.error('Error generating types:');
    console.error(error);
    process.exit(1);
  }
};

generate();
