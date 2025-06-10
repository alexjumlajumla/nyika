// Allow TypeScript to understand CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Allow TypeScript to understand image imports
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

// Payload CMS Types
declare module 'payload' {
  export interface User {
    id: string;
    email: string;
    roles: string[];
    [key: string]: unknown;
  }

  export interface AccessArgs {
    req: {
      user?: User;
      payload: any;
    };
    id?: string;
    data?: Record<string, unknown>;
  }

  export type AccessFunction = (args: AccessArgs) => boolean | Promise<boolean>;
}

declare module 'payload/types' {
  export interface CollectionConfig {
    slug: string;
    admin?: {
      useAsTitle?: string;
      [key: string]: unknown;
    };
    access?: {
      read?: AccessFunction | { [key: string]: AccessFunction };
      create?: AccessFunction;
      update?: AccessFunction;
      delete?: AccessFunction;
    };
    fields: Field[];
    [key: string]: unknown;
  }

  export interface Field {
    name: string;
    type: string;
    label?: string;
    required?: boolean;
    [key: string]: unknown;
  }

  export type Access = (args: AccessArgs) => boolean | Promise<boolean>;

  export interface AccessArgs {
    req: {
      user?: {
        id: string;
        email: string;
        roles: string[];
        [key: string]: unknown;
      };
      payload: any;
    };
    id?: string;
    data?: Record<string, unknown>;
  }
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Global type declarations
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}

// Extend Window interface if needed
declare global {
  interface Window {
    // Add any global window properties here
  }
}
