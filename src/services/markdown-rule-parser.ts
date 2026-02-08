import { RuleMetadata } from "../domain/types.js"

export const parseMarkdownFile = (content: string): { content: string; metadata: RuleMetadata } | null => {
  if (!hasFrontmatter(content)) {
    return null
  }

  const frontmatterEnd = findFrontmatterEnd(content)
  if (frontmatterEnd === -1) {
    return null
  }

  const frontmatterText = extractFrontmatterText(content, frontmatterEnd)
  const bodyContent = extractBodyContent(content, frontmatterEnd)

  const metadata = parseYamlFrontmatter(frontmatterText)
  if (!metadata) {
    return null
  }

  return {
    content: bodyContent,
    metadata,
  }
}

const hasFrontmatter = (content: string): boolean => {
  return content.startsWith("---")
}

const findFrontmatterEnd = (content: string): number => {
  return content.indexOf("---", 3)
}

const extractFrontmatterText = (content: string, endIndex: number): string => {
  return content.slice(3, endIndex).trim()
}

const extractBodyContent = (content: string, endIndex: number): string => {
  return content.slice(endIndex + 3).trim()
}

const parseYamlFrontmatter = (yamlText: string): RuleMetadata | null => {
  const lines = yamlText.split("\n")
  const metadata: Partial<RuleMetadata> = {}

  for (const line of lines) {
    parseYamlLine(line, metadata)
  }

  if (!hasRequiredFields(metadata)) {
    return null
  }

  return {
    fileTypes: metadata.fileTypes,
    folders: metadata.folders,
    priority: metadata.priority,
  }
}

const parseYamlLine = (line: string, metadata: Partial<RuleMetadata>): void => {
  if (isCommentLine(line)) {
    return
  }

  const keyValue = extractKeyValue(line)
  if (!keyValue) {
    return
  }

  const { key, value } = keyValue

  if (key === "fileTypes" || key === "folders") {
    const arrayValue = parseArrayField(key, value)
    if (arrayValue) {
      metadata[key] = arrayValue
    }
  } else if (key === "priority") {
    metadata.priority = parsePriorityField(value)
  }
}

const isCommentLine = (line: string): boolean => {
  const trimmed = line.trim()
  return !trimmed || trimmed.startsWith("#")
}

const extractKeyValue = (line: string): { key: string; value: string } | null => {
  const colonIndex = line.indexOf(":")
  if (colonIndex === -1) {
    return null
  }

  const key = line.slice(0, colonIndex).trim()
  const value = line.slice(colonIndex + 1).trim()

  return { key, value }
}

const parseArrayField = (key: string, value: string): string[] | null => {
  if (key !== "fileTypes" && key !== "folders") {
    return null
  }
  return parseYamlArray(value)
}

const parsePriorityField = (value: string): number | undefined => {
  const priority = Number.parseInt(value, 10)
  if (Number.isNaN(priority)) {
    return undefined
  }
  return priority
}

const hasRequiredFields = (metadata: Partial<RuleMetadata>): metadata is RuleMetadata => {
  return !!metadata.fileTypes && !!metadata.folders
}

const parseYamlArray = (value: string): string[] | null => {
  if (!isArrayFormat(value)) {
    return null
  }

  const content = extractArrayContent(value)
  return parseArrayItems(content)
}

const isArrayFormat = (value: string): boolean => {
  const trimmed = value.trim()
  return trimmed.startsWith("[") && trimmed.endsWith("]")
}

const extractArrayContent = (value: string): string => {
  const trimmed = value.trim()
  return trimmed.slice(1, -1).trim()
}

const parseArrayItems = (content: string): string[] => {
  if (!content) {
    return []
  }

  return content.split(",").map((item) => {
    return removeQuotes(item.trim())
  })
}

const removeQuotes = (value: string): string => {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1)
  }
  return value
}
