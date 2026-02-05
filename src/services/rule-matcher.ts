import { Rule, RuleMatchCriteria } from "../domain/types.js"
import { RuleRepository } from "../domain/repository.js"
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
    if (criteria.intent !== undefined && rule.metadata.intent !== criteria.intent) {
      return false
    }
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
