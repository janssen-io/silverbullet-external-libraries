import { editor } from "@silverbulletmd/silverbullet/syscalls";
import { space, system } from "@silverbulletmd/silverbullet/syscalls";
import { Resolver } from "./resolvers/resolver.ts";
import { GithubUserContentResolver } from "./resolvers/githubUserContentResolver.ts";

export async function downloadExternalLibraries() {
  const allExternalLibraries = await system.getSpaceConfig(
    "externalLibraries",
    [],
  );

  const fileListCache: { [key: string]: { name: string }[] } = {};
  for (const lib of allExternalLibraries) {
    const [scheme, rest] = lib.split("://");
    console.log("extLib | Lib", scheme, rest);

    let resolver: Resolver;
    let path: string;
    if (scheme === "gh") {
      const [user, repo, ...pathParts] = rest.split("/");
      if (pathParts[0] !== "Library") {
        await editor.flashNotification("Skipping library " + lib, "error");
        console.warn(
          "Skipping External Library, because of path does not start with 'Library'",
          lib,
        );
        return;
      }
      resolver = new GithubUserContentResolver(user, repo);

      path = pathParts.join("/");
    } else {
      await editor.flashNotification("Skipping library " + lib, "error");
      console.warn("Skipping External Library, because of unknown scheme", lib);
      continue;
    }

    // Find all files in this repo to download:
    if (fileListCache[resolver.key] === undefined) {
      const req = await fetch(resolver.resolvePath("index.json"));
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
      const req = await fetch(resolver.resolvePath(file.name));
      const text = await req.text();

      space.writeAttachment(file.name, new TextEncoder().encode(text));
    }
  }
}
