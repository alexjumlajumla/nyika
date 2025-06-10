// Allow TypeScript to understand CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declare module for UI components
declare module '@/components/ui/button' {
  import { ComponentType, ButtonHTMLAttributes } from 'react';
  
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  const Button: ComponentType<ButtonProps>;
  export { Button, ButtonProps };
}

declare module '@/components/ui/dropdown-menu' {
  import { ComponentType, ReactNode } from 'react';
  
  interface DropdownMenuProps {
    children: ReactNode;
  }
  
  interface DropdownMenuTriggerProps {
    asChild?: boolean;
    children: ReactNode;
  }
  
  interface DropdownMenuContentProps {
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    children: ReactNode;
  }
  
  interface DropdownMenuItemProps {
    onSelect?: (event: Event) => void;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
  }
  
  const DropdownMenu: ComponentType<DropdownMenuProps> & {
    Trigger: ComponentType<DropdownMenuTriggerProps>;
    Content: ComponentType<DropdownMenuContentProps>;
    Item: ComponentType<DropdownMenuItemProps>;
    // Add other DropdownMenu components as needed
  };
  
  export {
    DropdownMenu,
    DropdownMenuProps,
    DropdownMenuTriggerProps,
    DropdownMenuContentProps,
    DropdownMenuItemProps
  };
}

// Declare module for LocaleSwitcher component
declare module '@/components/locale-switcher' {
  import { ComponentType } from 'react';
  
  interface LocaleSwitcherProps {
    // Add any props if needed
  }
  
  const LocaleSwitcher: ComponentType<LocaleSwitcherProps>;
  export default LocaleSwitcher;
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
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
  }
}

// Extend Window interface if needed
declare global {
  interface Window {
    // Add any global window properties here
  }
}
