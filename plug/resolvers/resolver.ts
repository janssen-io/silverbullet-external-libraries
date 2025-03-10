export interface Resolver {
  key: string;
  resolveUrl(url: string): string;
  resolvePath(path: string): string;
}
