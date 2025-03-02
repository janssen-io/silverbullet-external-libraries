import { assert, assertEquals } from "@std/assert";
import { getLibraryPath, getLibraryRoot } from "./external-libraries.ts";

Deno.test("getLibraryRoot: undefined if not a library", () => {
  assertEquals(getLibraryRoot(["a", "b", "c"], []), undefined);
  assertEquals(getLibraryRoot([], ["a", "b", "c"]), undefined);
});

Deno.test("getLibraryRoot: empty if at the root", () => {
  assertEquals(getLibraryRoot(["Library"], []), []);
  assertEquals(getLibraryRoot(["Library"], ["a"]), ["a"]);
});

Deno.test("getLibraryRoot: parent dirs if in sub directory", () => {
  assertEquals(getLibraryRoot(["Root", "Sub", "Library"], []), ["Root", "Sub"]);
  assertEquals(getLibraryRoot(["Sub", "Library", "Child"], ["Root"]), [
    "Root",
    "Sub",
  ]);
});

Deno.test("getLibraryPath: identical if root is the actual root", () => {
  const path = "Library/Test";
  const root = "";
  assertEquals(getLibraryPath(path, root), path);
});

Deno.test("getLibraryPath: Starts with Library/", () => {
  const path = "Alternative/Root/Library/Test";
  const root = "Alternative/Root";
  assertEquals(getLibraryPath(path, root), "Library/Test");
});
