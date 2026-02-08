import { Rule, RuleMatchCriteria } from "../types.js"
import { RuleRepository } from "./file-system-rule-repository.js"
import {
  matchesFileTypePattern,
  pathStartsWithFolder,
} from "../utils/path-matching.js"

const createRuleMatcher = (repository: RuleRepository) => {
  const matchRules = async (criteria: RuleMatchCriteria): Promise<Rule[]> => {
    const allRules = await repository.listAllRules()
    const matchingRules = allRules.filter((rule) => ruleMatchesAnyPath(rule, criteria))
    return sortByPriorityDescending(matchingRules)
  }

  const ruleMatchesAnyPath = (rule: Rule, criteria: RuleMatchCriteria): boolean => {
    return criteria.filePaths.some((filePath) => pathMatchesRule(filePath, rule))
  }

  const pathMatchesRule = (filePath: string, rule: Rule): boolean => {
    const matchesFileType = rule.metadata.fileTypes.some((pattern) =>
      matchesFileTypePattern(filePath, pattern)
    )
    if (!matchesFileType) {
      return false
    }
    return rule.metadata.folders.some((folder) => pathStartsWithFolder(filePath, folder))
  }

  const sortByPriorityDescending = (rules: Rule[]): Rule[] => {
    return [...rules].sort((a, b) => (b.metadata.priority ?? 0) - (a.metadata.priority ?? 0))
  }

  return {
    matchRules,
  }
}

export { createRuleMatcher }
