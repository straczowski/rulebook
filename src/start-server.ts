import express from "express"
import { parseConfig } from "./utils/parse-config.js"
import { createMcpTransport } from "./mcp/create-mcp-transport.js"

const startServer = async () => {
  const { port, rulesDirectory } = parseConfig()

  const app = express()
  app.use(express.json())

  app.get("", (_req, res) => {
    res.json({ status: "ok" })
  })

  const mcpTransport = await createMcpTransport(rulesDirectory)
  app.all("/mcp", async (req, res) => {
    await mcpTransport.handleRequest(req, res, req.body)
  })

  app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
}

startServer().catch((error) => {
  process.stderr.write(`Fatal error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
