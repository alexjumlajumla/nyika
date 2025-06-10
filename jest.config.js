module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Transform ES modules in node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(payload|@payloadcms/plugin-cloud-storage)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Add support for ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
