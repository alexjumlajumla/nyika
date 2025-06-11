/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

// TypeScript path mappings for module resolution
declare module '@/components/*' {
  const component: any;
  export default component;
}

declare module '@/lib/*' {
  const lib: any;
  export default lib;
}

declare module '@/hooks/*' {
  const hook: any;
  export default hook;
}

declare module '@/types/*' {
  const type: any;
  export default type;
}

declare module '@/app/*' {
  const app: any;
  export default app;
}

declare module '@/messages/*' {
  const message: any;
  export default message;
}

declare module '@/config/*' {
  const config: any;
  export default config;
}

declare module '@/styles/*' {
  const style: any;
  export default style;
}
