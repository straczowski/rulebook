import assert from "node:assert"
import { describe, it } from "node:test"
import {
  normalizePath,
  matchesFileTypePattern,
  pathStartsWithFolder,
} from "../../src/utils/path-matching.js"

describe("path-matching", () => {
  it("should normalize path by converting backslashes to forward slashes", () => {
    assert.equal(normalizePath("src\\components\\foo.ts"), "src/components/foo.ts")
  })

  it("should match file type when path extension equals pattern extension", () => {
    assert.equal(matchesFileTypePattern("src/foo.ts", "*.ts"), true)
    assert.equal(matchesFileTypePattern("bar.tsx", "*.tsx"), true)
    assert.equal(matchesFileTypePattern("src/foo.ts", "*.tsx"), false)
  })

  it("should return false for file type pattern when pattern does not start with *.", () => {
    assert.equal(matchesFileTypePattern("src/foo.ts", "*.ts"), true)
    assert.equal(matchesFileTypePattern("src/foo.ts", "ts"), false)
  })

  it("should return true when path equals folder or path is under folder", () => {
    assert.equal(pathStartsWithFolder("src/components", "src/components"), true)
    assert.equal(pathStartsWithFolder("src/components/foo.ts", "src/components"), true)
    assert.equal(pathStartsWithFolder("src/components-other/foo.ts", "src/components"), false)
  })

  it("should return true for any path when folder is empty string", () => {
    assert.equal(pathStartsWithFolder("src/foo.ts", ""), true)
  })
})
