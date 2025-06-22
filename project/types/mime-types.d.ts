declare module 'mime-types' {
  export function extension(mimeType: string): string | false;
  export function lookup(path: string): string | false;
  export function contentType(path: string): string | false;
} 