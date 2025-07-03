// Custom type declarations for external libraries

declare module "react" {
  export * from 'react';
}

declare module "lucide-react" {
  export const FileText: React.FC<any>;
  export const Presentation: React.FC<any>;
  export const Download: React.FC<any>;
  export const Zap: React.FC<any>;
  export const Users: React.FC<any>;
  export const BookOpen: React.FC<any>;
}

// For Vite environment variables
interface ImportMeta {
  env: {
    VITE_API_URL?: string;
    [key: string]: any;
  }
}
