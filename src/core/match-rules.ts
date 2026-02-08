import { extname } from "node:path"
import { Rule, RuleMatchCriteria } from "../types.js"

export const matchRules = (rules: Rule[], criteria: RuleMatchCriteria): Rule[] => {
  const matchingRules = rules.filter((rule) => ruleMatchesAnyPath(rule, criteria))
  return sortByPriorityDescending(matchingRules)
}

const ruleMatchesAnyPath = (rule: Rule, criteria: RuleMatchCriteria): boolean => {
  return criteria.filePaths.some((filePath) => pathMatchesRule(filePath, rule))
}

const pathMatchesRule = (filePath: string, rule: Rule): boolean => {
  const matchesFileType = pathMatchesFileTypes(filePath, rule)
  if (!matchesFileType) {
    return false
  }
  return pathMatchesFolders(filePath, rule)
}

const pathMatchesFileTypes = (filePath: string, rule: Rule): boolean => {
  return rule.metadata.fileTypes.some((pattern) =>
    matchesFileTypePattern(filePath, pattern)
  )
}

const pathMatchesFolders = (filePath: string, rule: Rule): boolean => {
  return rule.metadata.folders.some((folder) =>
    pathStartsWithFolder(filePath, folder)
  )
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

const normalizePath = (path: string): string => {
  return path.replaceAll("\\", "/")
}

const sortByPriorityDescending = (rules: Rule[]): Rule[] => {
  return [...rules].sort((a, b) => (b.metadata.priority ?? 0) - (a.metadata.priority ?? 0))
}
