var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/x/silverbullet@0.10.4/lib/plugos/worker_runtime.ts
var workerPostMessage = (_msg) => {
  throw new Error("Not initialized yet");
};
var runningAsWebWorker = typeof window === "undefined" && // @ts-ignore: globalThis
typeof globalThis.WebSocketPair === "undefined";
if (typeof Deno === "undefined") {
  self.Deno = {
    args: [],
    // @ts-ignore: Deno hack
    build: {
      arch: "x86_64"
    },
    env: {
      // @ts-ignore: Deno hack
      get() {
      }
    }
  };
}
var pendingRequests = /* @__PURE__ */ new Map();
var syscallReqId = 0;
if (runningAsWebWorker) {
  globalThis.syscall = async (name, ...args) => {
    return await new Promise((resolve, reject) => {
      syscallReqId++;
      pendingRequests.set(syscallReqId, { resolve, reject });
      workerPostMessage({
        type: "sys",
        id: syscallReqId,
        name,
        args
      });
    });
  };
}
function setupMessageListener(functionMapping2, manifest2, postMessageFn) {
  if (!runningAsWebWorker) {
    return;
  }
  workerPostMessage = postMessageFn;
  self.addEventListener("message", (event) => {
    (async () => {
      const data = event.data;
      switch (data.type) {
        case "inv":
          {
            const fn = functionMapping2[data.name];
            if (!fn) {
              throw new Error(`Function not loaded: ${data.name}`);
            }
            try {
              const result = await Promise.resolve(fn(...data.args || []));
              workerPostMessage({
                type: "invr",
                id: data.id,
                result
              });
            } catch (e) {
              console.error(
                "An exception was thrown as a result of invoking function",
                data.name,
                "error:",
                e.message
              );
              workerPostMessage({
                type: "invr",
                id: data.id,
                error: e.message
              });
            }
          }
          break;
        case "sysr":
          {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
          break;
      }
    })().catch(console.error);
  });
  workerPostMessage({
    type: "manifest",
    manifest: manifest2
  });
}
function base64Decode(s) {
  const binString = atob(s);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}
function base64Encode(buffer) {
  if (typeof buffer === "string") {
    buffer = new TextEncoder().encode(buffer);
  }
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}
async function sandboxFetch(reqInfo, options) {
  if (typeof reqInfo !== "string") {
    const body = new Uint8Array(await reqInfo.arrayBuffer());
    const encodedBody = body.length > 0 ? base64Encode(body) : void 0;
    options = {
      method: reqInfo.method,
      headers: Object.fromEntries(reqInfo.headers.entries()),
      base64Body: encodedBody
    };
    reqInfo = reqInfo.url;
  }
  return syscall("sandboxFetch.fetch", reqInfo, options);
}
globalThis.nativeFetch = globalThis.fetch;
function monkeyPatchFetch() {
  globalThis.fetch = async function(reqInfo, init) {
    const encodedBody = init && init.body ? base64Encode(
      new Uint8Array(await new Response(init.body).arrayBuffer())
    ) : void 0;
    const r = await sandboxFetch(
      reqInfo,
      init && {
        method: init.method,
        headers: init.headers,
        base64Body: encodedBody
      }
    );
    return new Response(r.base64Body ? base64Decode(r.base64Body) : null, {
      status: r.status,
      headers: r.headers
    });
  };
}
if (runningAsWebWorker) {
  monkeyPatchFetch();
}

// https://jsr.io/@silverbulletmd/silverbullet/0.9.4/plug-api/syscalls/editor.ts
var editor_exports = {};
__export(editor_exports, {
  confirm: () => confirm,
  copyToClipboard: () => copyToClipboard,
  deleteLine: () => deleteLine,
  dispatch: () => dispatch,
  downloadFile: () => downloadFile,
  filterBox: () => filterBox,
  flashNotification: () => flashNotification,
  fold: () => fold,
  foldAll: () => foldAll,
  getCurrentPage: () => getCurrentPage,
  getCursor: () => getCursor,
  getSelection: () => getSelection,
  getText: () => getText,
  getUiOption: () => getUiOption,
  goHistory: () => goHistory,
  hidePanel: () => hidePanel,
  insertAtCursor: () => insertAtCursor,
  insertAtPos: () => insertAtPos,
  moveCursor: () => moveCursor,
  moveCursorToLine: () => moveCursorToLine,
  navigate: () => navigate,
  openCommandPalette: () => openCommandPalette,
  openPageNavigator: () => openPageNavigator,
  openSearchPanel: () => openSearchPanel,
  openUrl: () => openUrl,
  prompt: () => prompt,
  redo: () => redo,
  reloadConfigAndCommands: () => reloadConfigAndCommands,
  reloadPage: () => reloadPage,
  reloadUI: () => reloadUI,
  replaceRange: () => replaceRange,
  save: () => save,
  setSelection: () => setSelection,
  setText: () => setText,
  setUiOption: () => setUiOption,
  showPanel: () => showPanel,
  toggleFold: () => toggleFold,
  undo: () => undo,
  unfold: () => unfold,
  unfoldAll: () => unfoldAll,
  uploadFile: () => uploadFile,
  vimEx: () => vimEx
});

// https://jsr.io/@silverbulletmd/silverbullet/0.9.4/plug-api/syscall.ts
if (typeof self === "undefined") {
  self = {
    syscall: () => {
      throw new Error("Not implemented here");
    }
  };
}
function syscall2(name, ...args) {
  return globalThis.syscall(name, ...args);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.9.4/plug-api/syscalls/editor.ts
function getCurrentPage() {
  return syscall2("editor.getCurrentPage");
}
function getText() {
  return syscall2("editor.getText");
}
function setText(newText) {
  return syscall2("editor.setText", newText);
}
function getCursor() {
  return syscall2("editor.getCursor");
}
function getSelection() {
  return syscall2("editor.getSelection");
}
function setSelection(from, to) {
  return syscall2("editor.setSelection", from, to);
}
function save() {
  return syscall2("editor.save");
}
function navigate(pageRef, replaceState = false, newWindow = false) {
  return syscall2("editor.navigate", pageRef, replaceState, newWindow);
}
function openPageNavigator(mode = "page") {
  return syscall2("editor.openPageNavigator", mode);
}
function openCommandPalette() {
  return syscall2("editor.openCommandPalette");
}
function reloadPage() {
  return syscall2("editor.reloadPage");
}
function reloadUI() {
  return syscall2("editor.reloadUI");
}
function reloadConfigAndCommands() {
  return syscall2("editor.reloadConfigAndCommands");
}
function openUrl(url, existingWindow = false) {
  return syscall2("editor.openUrl", url, existingWindow);
}
function goHistory(delta) {
  return syscall2("editor.goHistory", delta);
}
function downloadFile(filename, dataUrl) {
  return syscall2("editor.downloadFile", filename, dataUrl);
}
function uploadFile(accept, capture) {
  return syscall2("editor.uploadFile", accept, capture);
}
function flashNotification(message, type = "info") {
  return syscall2("editor.flashNotification", message, type);
}
function filterBox(label, options, helpText = "", placeHolder = "") {
  return syscall2("editor.filterBox", label, options, helpText, placeHolder);
}
function showPanel(id, mode, html, script = "") {
  return syscall2("editor.showPanel", id, mode, html, script);
}
function hidePanel(id) {
  return syscall2("editor.hidePanel", id);
}
function insertAtPos(text, pos) {
  return syscall2("editor.insertAtPos", text, pos);
}
function replaceRange(from, to, text) {
  return syscall2("editor.replaceRange", from, to, text);
}
function moveCursor(pos, center = false) {
  return syscall2("editor.moveCursor", pos, center);
}
function moveCursorToLine(line, column = 1, center = false) {
  return syscall2("editor.moveCursorToLine", line, column, center);
}
function insertAtCursor(text) {
  return syscall2("editor.insertAtCursor", text);
}
function dispatch(change) {
  return syscall2("editor.dispatch", change);
}
function prompt(message, defaultValue = "") {
  return syscall2("editor.prompt", message, defaultValue);
}
function confirm(message) {
  return syscall2("editor.confirm", message);
}
function getUiOption(key) {
  return syscall2("editor.getUiOption", key);
}
function setUiOption(key, value) {
  return syscall2("editor.setUiOption", key, value);
}
function fold() {
  return syscall2("editor.fold");
}
function unfold() {
  return syscall2("editor.unfold");
}
function toggleFold() {
  return syscall2("editor.toggleFold");
}
function foldAll() {
  return syscall2("editor.foldAll");
}
function unfoldAll() {
  return syscall2("editor.unfoldAll");
}
function undo() {
  return syscall2("editor.undo");
}
function redo() {
  return syscall2("editor.redo");
}
function openSearchPanel() {
  return syscall2("editor.openSearchPanel");
}
function copyToClipboard(data) {
  return syscall2("editor.copyToClipboard", data);
}
function deleteLine() {
  return syscall2("editor.deleteLine");
}
function vimEx(exCommand) {
  return syscall2("editor.vimEx", exCommand);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.9.4/plug-api/syscalls/space.ts
var space_exports = {};
__export(space_exports, {
  deleteAttachment: () => deleteAttachment,
  deleteFile: () => deleteFile,
  deletePage: () => deletePage,
  fileExists: () => fileExists,
  getAttachmentMeta: () => getAttachmentMeta,
  getFileMeta: () => getFileMeta,
  getPageMeta: () => getPageMeta,
  listAttachments: () => listAttachments,
  listFiles: () => listFiles,
  listPages: () => listPages,
  listPlugs: () => listPlugs,
  readAttachment: () => readAttachment,
  readFile: () => readFile,
  readPage: () => readPage,
  writeAttachment: () => writeAttachment,
  writeFile: () => writeFile,
  writePage: () => writePage
});
function listPages() {
  return syscall2("space.listPages");
}
function getPageMeta(name) {
  return syscall2("space.getPageMeta", name);
}
function readPage(name) {
  return syscall2("space.readPage", name);
}
function writePage(name, text) {
  return syscall2("space.writePage", name, text);
}
function deletePage(name) {
  return syscall2("space.deletePage", name);
}
function listPlugs() {
  return syscall2("space.listPlugs");
}
function listAttachments() {
  return syscall2("space.listAttachments");
}
function getAttachmentMeta(name) {
  return syscall2("space.getAttachmentMeta", name);
}
function readAttachment(name) {
  return syscall2("space.readAttachment", name);
}
function writeAttachment(name, data) {
  return syscall2("space.writeAttachment", name, data);
}
function deleteAttachment(name) {
  return syscall2("space.deleteAttachment", name);
}
function listFiles() {
  return syscall2("space.listFiles");
}
function readFile(name) {
  return syscall2("space.readFile", name);
}
function getFileMeta(name) {
  return syscall2("space.getFileMeta", name);
}
function writeFile(name, data) {
  return syscall2("space.writeFile", name, data);
}
function deleteFile(name) {
  return syscall2("space.deleteFile", name);
}
function fileExists(name) {
  return syscall2("space.fileExists", name);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.9.4/plug-api/syscalls/system.ts
var system_exports = {};
__export(system_exports, {
  applyAttributeExtractors: () => applyAttributeExtractors,
  getEnv: () => getEnv,
  getMode: () => getMode,
  getSpaceConfig: () => getSpaceConfig,
  getVersion: () => getVersion,
  invokeCommand: () => invokeCommand,
  invokeFunction: () => invokeFunction,
  invokeSpaceFunction: () => invokeSpaceFunction,
  listCommands: () => listCommands,
  listSyscalls: () => listSyscalls,
  reloadConfig: () => reloadConfig,
  reloadPlugs: () => reloadPlugs
});
function invokeFunction(name, ...args) {
  return syscall2("system.invokeFunction", name, ...args);
}
function invokeCommand(name, args) {
  return syscall2("system.invokeCommand", name, args);
}
function listCommands() {
  return syscall2("system.listCommands");
}
function listSyscalls() {
  return syscall2("system.listSyscalls");
}
function invokeSpaceFunction(name, ...args) {
  return syscall2("system.invokeSpaceFunction", name, ...args);
}
function applyAttributeExtractors(tags, text, tree) {
  return syscall2("system.applyAttributeExtractors", tags, text, tree);
}
async function getSpaceConfig(key, defaultValue) {
  return await syscall2("system.getSpaceConfig", key) ?? defaultValue;
}
function reloadPlugs() {
  return syscall2("system.reloadPlugs");
}
function reloadConfig() {
  return syscall2("system.reloadConfig");
}
function getEnv() {
  return syscall2("system.getEnv");
}
function getMode() {
  return syscall2("system.getMode");
}
function getVersion() {
  return syscall2("system.getVersion");
}

// ../../../Data/Software/silverbullet-github-libraries-plug/plug/resolvers/githubUserContentResolver.ts
var GithubUserContentResolver = class {
  constructor(_user, _repository, branch = "main") {
    this._user = _user;
    this._repository = _repository;
    this._baseUrl = `https://raw.githubusercontent.com/${_user}/${_repository}/refs/heads/${branch}`;
    this.key = `gh://${_user}/${_repository}`;
  }
  _baseUrl;
  key;
  resolveUrl(url) {
    const [_, ...pathParts] = url.split(this._repository);
    const path = pathParts.join("/");
    return this.resolvePath(path);
  }
  resolvePath(path) {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this._baseUrl}/${normalizedPath}`;
  }
};

// ../../../Data/Software/silverbullet-github-libraries-plug/plug/resolvers/StaticFileResolver.ts
var StaticFileResolver = class {
  constructor(_domain, _scheme = "https") {
    this._domain = _domain;
    this._scheme = _scheme;
    this.key = _domain;
  }
  key;
  resolveUrl(url) {
    return url;
  }
  resolvePath(path) {
    return `${this._scheme}://${this._domain}/${path}`;
  }
};

// ../../../Data/Software/silverbullet-github-libraries-plug/plug/github-libraries.ts
async function downloadExternalLibraries() {
  const allExternalLibraries = await system_exports.getSpaceConfig(
    "externalLibraries",
    []
  );
  const fileListCache = {};
  for (const lib of allExternalLibraries) {
    await download(lib, fileListCache);
  }
}
async function download(lib, fileListCache) {
  let { resolver, path } = createResolver(lib);
  if (resolver === void 0 || path === void 0) {
    await editor_exports.flashNotification("Skipping library " + lib, "error");
    console.warn("Skipping External Library, because of unknown scheme", lib);
    return;
  }
  const libraryRoot = getLibraryRoot(path.split("/"));
  if (libraryRoot === void 0) {
    await editor_exports.flashNotification("Skipping library " + lib, "error");
    console.warn(
      "Skipping External Library, because it does not contain a Library directory",
      lib
    );
    return;
  }
  const root = libraryRoot.join("/");
  path = path.substring(root.length);
  if (path.startsWith("/")) {
    path.substring(1);
  }
  if (fileListCache[resolver.key] === void 0) {
    const req = await fetch(resolver.resolvePath(`${root}/index.json`));
    fileListCache[resolver.key] = await req.json();
  }
  const libraryFiles = fileListCache[resolver.key].filter(
    (entry) => entry.name.startsWith(path)
  );
  await editor_exports.flashNotification(
    `Downloading ${libraryFiles.length} files for library '${lib}'`
  );
  for (const file of libraryFiles) {
    const req = await fetch(resolver.resolvePath(`${root}/${file.name}`));
    const text = await req.text();
    space_exports.writeAttachment(file.name, new TextEncoder().encode(text));
  }
}
function createResolver(lib) {
  const [scheme, rest] = lib.split("://");
  console.log("extLib | Lib", scheme, rest);
  let resolver;
  let path;
  if (scheme === "gh") {
    const [user, repo, ...pathParts] = rest.split("/");
    resolver = new GithubUserContentResolver(user, repo);
    path = pathParts.join("/");
  } else if (scheme === "https") {
    const [domain, ...pathParts] = rest.split("/");
    resolver = new StaticFileResolver(domain);
    path = pathParts.join("/");
  } else {
    return {};
  }
  return { resolver, path };
}
function getLibraryRoot([current, ...children], parents = []) {
  if (current === void 0)
    return void 0;
  if (current === "Library")
    return parents;
  parents.push(current);
  getLibraryRoot(children, parents);
}

// efda14f7cc38edb5.js
var functionMapping = {
  downloadExternalLibraries
};
var manifest = {
  "name": "github-libraries",
  "requiredPermissions": [
    "fetch"
  ],
  "functions": {
    "downloadExternalLibraries": {
      "path": "plug/github-libraries.ts:downloadExternalLibraries",
      "command": {
        "name": "Download External Libraries"
      }
    }
  },
  "assets": {}
};
var plug = { manifest, functionMapping };
setupMessageListener(functionMapping, manifest, self.postMessage);
export {
  plug
};
//# sourceMappingURL=github-libraries.plug.js.map
