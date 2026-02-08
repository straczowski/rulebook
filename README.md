# Rulebook

An MCP server for managing and serving Markdown coding rules to AI agents during refactoring. It also exposes a web interface for humans to manage these rules.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: ExpressJS
- **Template Engine**: EJS (server-side rendering)
- **Storage**: Filesystem-based (no database)

## Project Structure

```
rulebook/
├── src/
│   ├── services/        # Business logic services
│   ├── api/             # HTTP API routes
│   ├── mcp/             # MCP server implementation
│   ├── web/              # Web UI routes and templates
│   └── index.ts         # Application entry point
├── rules/                # Markdown rule files (see docs/rule-file-format.md)
├── docs/                 # Documentation (rule format, etc.)
├── views/                # EJS templates (to be created)
├── spec/                 # Project specifications
└── dist/                 # Compiled JavaScript output
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

Or run in development mode with auto-reload:
```bash
npm run dev
```

## Rules Directory

Rule files are stored under `./rules` (override with `RULES_DIRECTORY`). See [Rule File Format](docs/rule-file-format.md) for YAML frontmatter and naming conventions. Example rules are in `rules/typescript/`.

## MCP Server

The MCP server is part of the same Express app. After starting the server (`npm start`), MCP is available over Streamable HTTP at `/mcp` (same host and port). It exposes the tool `get_applicable_rules`.

Cursor does not yet support Streamable HTTP natively. To use Rulebook from Cursor, configure the **STDIO-to-Streamable-HTTP adapter** so Cursor (stdio) talks to the adapter, and the adapter talks to Rulebook at `/mcp`. See [Connecting Cursor](docs/cursor-setup.md) for step-by-step setup.

## Health Check

Once running, check the health endpoint:
```bash
curl http://localhost:3000/health
```

## Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the server (HTTP + MCP at `/mcp`)
- `npm run dev` - Run in development mode with auto-reload
- `npm run type-check` - Type check without building
- `npm test` - Run unit tests

## License

MIT
