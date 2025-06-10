// Mock for Payload CMS configuration
const config = {
  admin: { 
    user: 'users', 
    bundler: jest.fn() 
  },
  db: jest.fn(),
  collections: [],
  globals: [],
  typescript: { 
    outputFile: '' 
  },
  plugins: []
};

export default config;
