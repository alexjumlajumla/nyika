// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

// Minimal ESLint configuration for Next.js with TypeScript
export default [
  // Base configuration with ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/*.d.ts',
    ],
  },
  
  // Basic rules for JavaScript and TypeScript
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off', // Handled by TypeScript
    },
  },
  
  // TypeScript configuration
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  })),
  
  // React Hooks rules
  {
    files: ['**/*.tsx', '**/*.jsx', '**/hooks/**/*.ts', '**/hooks/**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
