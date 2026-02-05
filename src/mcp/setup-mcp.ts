import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createFileSystemRuleRepository } from "../services/file-system-rule-repository.js"
import { createRuleMatcher } from "../services/rule-matcher.js"

const createMcpServerWithTransport = async (rulesDirectory: string) => {
  const repository = createFileSystemRuleRepository(rulesDirectory)
  const matcher = createRuleMatcher(repository)

  const server = new McpServer(
    {
      name: "rulebook",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  )

  const handleGetApplicableRules = async (args: {
    filePaths: string[]
    intent?: string
  }) => {
    try {
      const criteria = { filePaths: args.filePaths, intent: args.intent }
      const rules = await matcher.matchRules(criteria)
      const rulesPayload = rules.map((rule) => ({
        id: rule.id,
        content: rule.content,
        metadata: rule.metadata,
      }))
      return {
        content: [
          {
            type: "text" as const,
            text:
              rules.length === 0
                ? "No applicable rules found for the given file paths."
                : JSON.stringify(rulesPayload, null, 2),
          },
        ],
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

  const toolHandler = async (args: unknown) => {
    const { filePaths, intent } = args as { filePaths: string[]; intent?: string }
    return handleGetApplicableRules({ filePaths, intent })
  }
  ;(server as { tool(name: string, description: string, schema: object, cb: (args: unknown) => Promise<unknown>): void }).tool(
    "get_applicable_rules",
    "Returns applicable coding rules for the given file paths. Use when refactoring or applying project rules to specific files.",
    {
      filePaths: z.array(z.string()).describe("List of file paths to match rules for"),
      intent: z.string().optional().describe("Optional intent filter (e.g. refactor, style, pattern)"),
    },
    toolHandler
  )

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  await server.connect(transport)
  return transport
}

export { createMcpServerWithTransport }
