export interface RuleMetadata {
  fileTypes: string[]
  folders: string[]
  priority?: number
}

export interface Rule {
  id: string
  content: string
  metadata: RuleMetadata
}

export interface RuleMatchCriteria {
  filePaths: string[]
}
