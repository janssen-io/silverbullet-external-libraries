export interface Resolver {
  key: string;
  resolveUrl(url: string): string;
  resolvePath(url: string): string;
}
