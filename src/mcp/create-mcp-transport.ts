import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createFileSystemRuleRepository } from "../services/file-system-rule-repository.js"
import { createRuleMatcher } from "../services/rule-matcher.js"
import { registerRuleMatcherTool } from "./register-rule-matcher-tool.js"

export const createMcpTransport = async (rulesDirectory: string) => {
  const server = createServer()
  const repository = createFileSystemRuleRepository(rulesDirectory)
  const matcher = createRuleMatcher(repository)
  registerRuleMatcherTool(server, matcher)
  return connectTransport(server)
}

const connectTransport = async (server: McpServer) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  await server.connect(transport)
  return transport
}

const createServer = () => {
  return new McpServer(
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
}
