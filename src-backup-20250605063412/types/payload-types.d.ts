// Type definitions for Payload CMS

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

  export interface CollectionAccess {
    read?: AccessFunction | { [key: string]: AccessFunction };
    create?: AccessFunction;
    update?: AccessFunction;
    delete?: AccessFunction;
  }
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

  export interface AccessFunction {
    (args: AccessArgs): boolean | Promise<boolean>;
  }

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
