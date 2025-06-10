import { CollectionConfig, Payload as BasePayload } from 'payload/types';

declare module 'payload' {
  export interface Payload extends BasePayload {
    find: (args: {
      collection: string;
      limit?: number;
      depth?: number;
    }) => Promise<{ totalDocs: number }>;
    
    create: (args: {
      collection: string;
      data: Record<string, unknown>;
    }) => Promise<unknown>;
  }
  
  export interface User {
    id: string;
    role: 'admin' | 'editor' | 'user';
    email: string;
    [key: string]: unknown;
  }

  export interface AccessArgs {
    req: {
      user?: User;
    };
    id?: string;
    data?: Record<string, unknown>;
  }

  export type AccessFunction = (args: AccessArgs) => boolean | Promise<boolean>;

  export interface CollectionAccess {
    read: AccessFunction | { [key: string]: AccessFunction };
    create: AccessFunction;
    update: AccessFunction;
    delete: AccessFunction;
  }
}

declare module 'payload/types' {
  export interface CollectionConfig {
    access?: {
      read?: AccessFunction | { [key: string]: AccessFunction };
      create?: AccessFunction;
      update?: AccessFunction;
      delete?: AccessFunction;
    };
  }
}
