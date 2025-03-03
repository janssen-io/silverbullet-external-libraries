import { editor } from "@silverbulletmd/silverbullet/syscalls";
import { space, system } from "@silverbulletmd/silverbullet/syscalls";
import { Resolver } from "./resolvers/resolver.ts";
import { GithubUserContentResolver } from "./resolvers/githubUserContentResolver.ts";
import { StaticFileResolver } from "./resolvers/StaticFileResolver.ts";

export async function downloadExternalLibraries() {
  const allExternalLibraries: string[] = await system.getSpaceConfig(
    "externalLibraries",
    [],
  );

  const fileListCache: { [key: string]: { name: string }[] } = {};
  for (const lib of allExternalLibraries) {
    await download(lib, fileListCache);
  }
}

async function download(
  lib: string,
  fileListCache: { [key: string]: { name: string }[] },
) {
  let { resolver, path } = createResolver(lib);
  if (resolver === undefined || path === undefined) {
    await editor.flashNotification("Skipping library " + lib, "error");
    console.warn("Skipping External Library, because of unknown scheme", lib);
    return;
  }

  const libraryRoot = getLibraryRoot(path.split("/"));
  if (libraryRoot === undefined) {
    await editor.flashNotification("Skipping library " + lib, "error");
    console.warn(
      "Skipping External Library, because it does not contain a Library directory",
      lib,
    );
    return;
  }

  const root = libraryRoot.join("/");
  path = getLibraryPath(path, root);

  // Find all files in this repo to download:
  if (fileListCache[resolver.key] === undefined) {
    const req = await fetch(resolver.resolvePath(`${root}/index.json`));
    fileListCache[resolver.key] = await req.json();
  }

  const libraryFiles: { name: string }[] = fileListCache[resolver.key]
    .filter(
      (entry) => entry.name.startsWith(path),
    );

  await editor.flashNotification(
    `Downloading ${libraryFiles.length} files for library '${lib}'`,
  );
  for (const file of libraryFiles) {
    const req = await fetch(resolver.resolvePath(`${root}/${file.name}`));
    const text = await req.text();

    space.writeAttachment(file.name, new TextEncoder().encode(text));
  }
}

export function getLibraryPath(path: string, root: string) {
  path = path.substring(root.length); // remove the part that is not part of the 'space'
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  return path;
}

export function createResolver(lib: string) {
  const [scheme, rest] = lib.split("://");
  let resolver: Resolver;
  let path: string;
  if (scheme === "gh" || scheme === "github") {
    const [user, repo, ...pathParts] = rest.split("/");
    resolver = new GithubUserContentResolver(user, repo);
    path = pathParts.join("/");
  } else if (scheme === "https" || scheme === "http") {
    const [domain, ...pathParts] = rest.split("/");
    resolver = new StaticFileResolver(domain, scheme);
    path = pathParts.join("/");
  } else {
    return {};
  }

  return { resolver, path };
}

export function getLibraryRoot(
  [current, ...children]: string[],
  parents: string[] = [],
) {
  if (current === undefined) {
    return undefined;
  }
  if (current === "Library") {
    return parents;
  }

  parents.push(current);
  return getLibraryRoot(children, parents);
}
