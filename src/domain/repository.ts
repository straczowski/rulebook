import { Rule, RuleMetadata } from "./types.js"

export interface RuleRepository {
  listAllRules(): Promise<Rule[]>
  getRuleById(id: string): Promise<Rule | null>
  createRule(id: string, content: string, metadata: RuleMetadata): Promise<Rule>
  deleteRule(id: string): Promise<void>
  updateRule(id: string, content: string, metadata: RuleMetadata): Promise<Rule>
}
