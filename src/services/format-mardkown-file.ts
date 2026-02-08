import { RuleMetadata } from "../domain/types"

export const formatMarkdownFile = (content: string, metadata: RuleMetadata): string => {
    const frontmatter = formatYamlFrontmatter(metadata)
    return `---\n${frontmatter}\n---\n\n${content}\n`
  }
  
  const formatYamlFrontmatter = (metadata: RuleMetadata): string => {
    const lines: string[] = []
  
    lines.push(formatFileTypesLine(metadata))
    lines.push(formatFoldersLine(metadata))
  
    const priorityLine = formatPriorityLine(metadata)
    if (priorityLine) {
      lines.push(priorityLine)
    }
  
    return lines.join("\n")
  }
  
  const formatFileTypesLine = (metadata: RuleMetadata): string => {
    const formatted = metadata.fileTypes.map((f) => `"${f}"`).join(", ")
    return `fileTypes: [${formatted}]`
  }
  
  const formatFoldersLine = (metadata: RuleMetadata): string => {
    const formatted = metadata.folders.map((f) => `"${f}"`).join(", ")
    return `folders: [${formatted}]`
  }
  
  const formatPriorityLine = (metadata: RuleMetadata): string | null => {
    if (metadata.priority === undefined) {
      return null
    }
    return `priority: ${metadata.priority}`
  }
  