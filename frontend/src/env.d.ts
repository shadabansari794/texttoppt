/// <reference types="vite/client" />

// Global type augmentations
declare module "*.tsx" {
  const content: any;
  export default content;
}

// Fix JSX runtime issues
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Add React global namespace
declare global {
  namespace React {
    interface FC<P = {}> {
      (props: P): React.ReactElement | null;
    }
    type ReactElement = any;
  }
}
