import { extname } from "node:path"

const normalizePath = (path: string): string => {
  return path.replaceAll("\\", "/")
}

const matchesFileTypePattern = (path: string, pattern: string): boolean => {
  if (!pattern.startsWith("*.")) {
    return false
  }
  const extension = pattern.slice(1)
  return extname(normalizePath(path)) === extension
}

const pathStartsWithFolder = (path: string, folder: string): boolean => {
  const normalizedPath = normalizePath(path)
  const normalizedFolder = normalizePath(folder)
  if (normalizedFolder === "") {
    return true
  }
  return (
    normalizedPath === normalizedFolder || normalizedPath.startsWith(normalizedFolder + "/")
  )
}

export { normalizePath, matchesFileTypePattern, pathStartsWithFolder }
