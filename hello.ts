import { editor } from "@silverbulletmd/silverbullet/syscalls";
import {
  system,
  space
} from "@silverbulletmd/silverbullet/syscalls";

export async function helloWorld() {
  const allExternalLibraries = await system.getSpaceConfig("externalLibraries", []);

  const fileListCache: { [key: string]: { name: string }[] } = {};
  for (let lib of allExternalLibraries) {
    const [scheme, rest] = lib.split("://");
    console.log("extLib | Lib", scheme, rest);

    if (scheme === "gh") {
      const [user, repo, ...pathParts] = rest.split("/");

      if (pathParts[0] !== "Library") {
        await editor.flashNotification("Skipping library " + lib);
        console.warn("Skipping External Library, because of path does not start with 'Library'", lib);
        return;
      }

      const path = pathParts.join('/')
      console.log("extLib | GitHub", user, repo, path);

      // Find all files in this repo to download:
      // https://raw.githubusercontent.com/janssen-io/silverbullet-libraries/refs/heads/main/index.json

      const cacheKey = `gh://${user}/${repo}`;
      const baseUrl = `https://raw.githubusercontent.com/janssen-io/silverbullet-libraries/refs/heads/main`;
      if (fileListCache[cacheKey] === undefined) {
        const req = await fetch(`${baseUrl}/index.json`);
        fileListCache[cacheKey] = await req.json();
        console.log('extLib', 'Downloaded external index', fileListCache[cacheKey]);
      }

      const libraryFiles: { name: string }[] = fileListCache[cacheKey].filter(entry => entry.name.startsWith(path));
      for (let file of libraryFiles) {
        const req = await fetch(`${baseUrl}/${file.name}`);
        const text = await req.text();

        space.writeAttachment(file.name, new TextEncoder().encode(text));
      }
    }
    else {
      await editor.flashNotification("Skipping library " + lib);
      console.warn("Skipping External Library, because of unknown scheme", lib);
    }
  }
}
