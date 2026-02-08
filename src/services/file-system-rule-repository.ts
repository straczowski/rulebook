import { readdir, readFile } from "node:fs/promises"
import { join, relative } from "node:path"
import { Rule, RuleMetadata } from "../types.js"
import { parseMarkdownFile } from "./markdown-rule-parser.js"

export interface RuleRepository {
  listAllRules(): Promise<Rule[]>
}

const createFileSystemRuleRepository = (rulesDirectory: string): RuleRepository => {
  const listAllRules = async (): Promise<Rule[]> => {
    try {
      const fileIds = await collectMarkdownFiles(rulesDirectory, rulesDirectory)
      return await loadRulesFromIds(fileIds)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
      return []
    }
  }

  const getRuleById = async (id: string): Promise<Rule | null> => {
    const filePath = getRulePath(id)

    try {
      const content = await readFileContent(filePath)
      const parsed = parseMarkdownFile(content)
      if (!parsed) {
        return null
      }

      return buildRuleFromParsed(id, parsed)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null
      }
      throw error
    }
  }

  const collectMarkdownFiles = async (dir: string, basePath: string): Promise<string[]> => {
    const fileIds: string[] = []
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await collectMarkdownFiles(fullPath, basePath)
        fileIds.push(...subFiles)
      } else if (entry.isFile() && isMarkdownFile(entry.name)) {
        const id = getRuleIdFromPath(fullPath, basePath)
        fileIds.push(id)
      }
    }

    return fileIds
  }

  const loadRulesFromIds = async (ids: string[]): Promise<Rule[]> => {
    const rules: Rule[] = []

    for (const id of ids) {
      const rule = await getRuleById(id)
      if (rule) {
        rules.push(rule)
      }
    }

    return rules
  }

  const getRulePath = (id: string): string => {
    return join(rulesDirectory, id)
  }

  const readFileContent = async (filePath: string): Promise<string> => {
    return await readFile(filePath, "utf-8")
  }

  const buildRuleFromParsed = (
    id: string,
    parsed: { content: string; metadata: RuleMetadata }
  ): Rule => {
    return {
      id,
      content: parsed.content,
      metadata: parsed.metadata,
    }
  }

  const isMarkdownFile = (fileName: string): boolean => {
    return fileName.endsWith(".md")
  }

  const getRuleIdFromPath = (fullPath: string, basePath: string): string => {
    return relative(basePath, fullPath)
  }

  return {
    listAllRules,
  }
}

export { createFileSystemRuleRepository }
