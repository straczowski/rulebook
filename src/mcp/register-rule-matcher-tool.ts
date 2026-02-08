import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { listAllRules } from "../core/list-all-rules.js"
import { matchRules } from "../core/match-rules.js"

const registerRuleMatcherTool = (
  server: McpServer,
  rulesDirectory: string
) => {
  const getApplicableRulesSchema = {
    filePaths: z.array(z.string()).describe("List of file paths to match rules for"),
  }
  const handler = async (args: unknown) => {
    const { filePaths } = args as { filePaths: string[] }
    return getApplicableRulesResponse(rulesDirectory, filePaths)
  }
  registerTool(
    server,
    "get_applicable_rules",
    "Returns applicable coding rules for the given file paths. Use when refactoring or applying project rules to specific files.",
    getApplicableRulesSchema,
    handler
  )
}

const getApplicableRulesResponse = async (
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
    const text =
      matchingRules.length === 0
        ? "No applicable rules found for the given file paths."
        : JSON.stringify(rulesPayload, null, 2)
    return {
      content: [{ type: "text" as const, text }],
      structuredContent: { rules: rulesPayload },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      content: [{ type: "text" as const, text: `Error: ${message}` }],
      isError: true,
    }
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

export { registerRuleMatcherTool }
