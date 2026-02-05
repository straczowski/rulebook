# Connecting Cursor to Rulebook

Rulebook exposes MCP over **Streamable HTTP** at `/mcp`. Cursor's MCP client supports stdio and SSE, not Streamable HTTP. Use the **MCP STDIO-to-Streamable-HTTP adapter** so Cursor can connect.

## Prerequisites

1. Rulebook is running (e.g. `npm start` in this repo). Default: `http://localhost:3000`.
2. Node.js available for the adapter (`npx`).

## Cursor MCP configuration

Add the adapter to your Cursor MCP settings. The adapter runs as a stdio MCP server that Cursor starts; it forwards to Rulebook over Streamable HTTP.

**Example configuration** (location depends on your OS; see [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol)):

```json
{
  "mcpServers": {
    "rulebook": {
      "command": "npx",
      "args": ["-y", "@pyroprompts/mcp-stdio-to-streamable-http-adapter"],
      "env": {
        "URI": "http://localhost:3000/mcp",
        "MCP_NAME": "rulebook"
      }
    }
  }
}
```

- **URI**: URL of your Rulebook server including the `/mcp` path. Use your actual host and port (e.g. `http://192.168.1.10:3000/mcp` if Rulebook runs on another machine).
- **MCP_NAME**: Optional; name shown in Cursor for this server.

Restart Cursor or reload MCP servers after changing the config. Rulebook should appear with one tool: `get_applicable_rules`.

## Verifying Rulebook is reachable

Before configuring Cursor, ensure Rulebook is up and the MCP endpoint is reachable:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{}'
```

You may get a JSON-RPC error (e.g. invalid request); that still means the server and `/mcp` are reachable. If Rulebook runs on another machine, use that host and port in both `URI` and `curl`.
