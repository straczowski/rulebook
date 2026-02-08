import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { listAllRules } from "../core/list-all-rules.js"
import { matchRules } from "../core/match-rules.js"

export const registerRuleMatcherTool = (
  server: McpServer,
  rulesDirectory: string
) => {
  const getApplicableRulesSchema = {
    filePaths: z.array(z.string()).describe("File paths you are working on; rules are returned for these paths"),
  }
  const handler = async (args: unknown) => {
    const { filePaths } = args as { filePaths: string[] }
    return getRulesResponse(rulesDirectory, filePaths)
  }
  registerTool(
    server,
    "get_rules_for_files",
    "Returns the user's coding rules (guidelines, principles) that match the given file paths. Call always before starting to code on those files, and when refactoring, editing, or when the user asks for coding rules, guidelines, or principles.",
    getApplicableRulesSchema,
    handler
  )
}

const getRulesResponse = async (
  rulesDirectory: string,
  filePaths: string[]
) => {
  try {
    const allRules = await listAllRules(rulesDirectory)
    const matchingRules = matchRules(allRules, { filePaths })
    const rulesPayload = matchingRules.map((rule) => ({
      id: rule.id,
      content: rule.content,
      metadata: rule.metadata,
    }))
    if (!matchingRules.length) {
      return respondNoRulesFound()
    }
    const text = JSON.stringify(rulesPayload, null, 2)
    return {
      content: [{ type: "text" as const, text }],
      structuredContent: { rules: matchingRules },
    }
  } catch (error) {
    return respondError(error)
  }
}

const respondNoRulesFound = () => {
  return {
    content: [{ type: "text" as const, text: "No rules found for the given file paths." }],
    isError: true,
  }
}

const respondError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  }
}

const registerTool = (
  server: McpServer,
  name: string,
  description: string,
  schema: object,
  callback: (args: unknown) => Promise<unknown>
) => {
  ;(server as { tool(name: string, description: string, schema: object, cb: (args: unknown) => Promise<unknown>): void }).tool(
    name,
    description,
    schema,
    callback
  )
}
