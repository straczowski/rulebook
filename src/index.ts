import express from "express"
import { parseConfig } from "./config.js"
import { createMcpServerWithTransport } from "./mcp/setup-mcp.js"

const startServer = async () => {
  const config = parseConfig()
  const mcpTransport = await createMcpServerWithTransport(config.rulesDirectory)

  const app = express()
  app.use(express.json())

  app.get("", (_req, res) => {
    res.json({ status: "ok" })
  })

  app.all("/mcp", async (req, res) => {
    await mcpTransport.handleRequest(req, res, req.body)
  })

  app.listen(config.port)
}

startServer().catch((error) => {
  process.stderr.write(`Fatal error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
