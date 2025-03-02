import { Resolver } from "./resolver.ts";

export class StaticFileResolver implements Resolver {
  key: string;

  constructor(private _domain: string, private _scheme: string = "https") {
    this.key = _domain;
  }

  resolveUrl(url: string): string {
    return url;
  }

  resolvePath(path: string): string {
    return `${this._scheme}://${this._domain}/${path}`;
  }
}
