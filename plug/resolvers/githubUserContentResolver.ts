import { Resolver } from "./resolver.ts";

export class GithubUserContentResolver implements Resolver {
  private _baseUrl: string;
  public key: string;

  constructor(
    private _user: string,
    private _repository: string,
    branch = "main",
  ) {
    this._baseUrl =
      `https://raw.githubusercontent.com/${_user}/${_repository}/refs/heads/${branch}`;

    this.key = `gh://${_user}/${_repository}`;
  }

  resolveUrl(url: string): string {
    const [_, ...pathParts] = url.split(this._repository);
    const path = pathParts.join("/");
    return this.resolvePath(path);
  }

  resolvePath(path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this._baseUrl}/${normalizedPath}`;
  }
}
