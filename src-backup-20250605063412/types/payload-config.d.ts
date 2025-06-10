import type { Config as GeneratedTypes } from 'payload/generated-types';
import type { Payload } from 'payload';
import type { CollectionConfig, PayloadRequest } from 'payload/types';

declare module 'payload/config' {
  export interface GeneratedTypes extends Config {}
  
  interface Config {
    // Extend the config type here if needed
  }
}

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
  
  // Extend the PayloadRequest type to include user
  interface PayloadRequest {
    user?: {
      id: string;
      role: 'admin' | 'editor' | 'user';
      [key: string]: unknown;
    };
  }
}

declare global {
  // This makes the Payload types available globally
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      payload: Payload;
    }
  }
}

export {};
