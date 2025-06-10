export const env = {
  // Server-side environment variables
  NODE_ENV: getEnvVar('NODE_ENV') || 'development',
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // Public environment variables (exposed to the client)
  NEXT_PUBLIC_SITE_URL: getEnvVar('NEXT_PUBLIC_SITE_URL'),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: getEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
  
  // Stripe
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  
  // Email
  EMAIL_SERVER_HOST: getEnvVar('EMAIL_SERVER_HOST'),
  EMAIL_SERVER_PORT: getEnvVar('EMAIL_SERVER_PORT'),
  EMAIL_SERVER_USER: getEnvVar('EMAIL_SERVER_USER'),
  EMAIL_SERVER_PASSWORD: getEnvVar('EMAIL_SERVER_PASSWORD'),
  EMAIL_FROM: getEnvVar('EMAIL_FROM'),
} as const;

function getEnvVar(key: string): string {
  const value = process.env[key];
  
  if (value === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️ Environment variable ${key} is not set.`);
    }
    return ''; // Return empty string as fallback
  }
  
  return value;
}

type EnvKeys = keyof typeof env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<EnvKeys, string> {}
  }
}
