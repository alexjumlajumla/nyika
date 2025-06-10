// This is a compatibility layer for Next.js to work with ESLint 8+
// The main configuration is in eslint.config.mjs

module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Add any specific rules you want to disable here
    '@next/next/no-html-link-for-pages': 'off',
  },
};
