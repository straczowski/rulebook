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
│   ├── domain/          # Core domain models and types
│   ├── services/        # Business logic services
│   ├── api/             # HTTP API routes
│   ├── mcp/             # MCP server implementation
│   ├── web/              # Web UI routes and templates
│   └── index.ts         # Application entry point
├── rules/                # Markdown rule files (to be created)
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

## Health Check

Once running, check the health endpoint:
```bash
curl http://localhost:3000/health
```

## Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with auto-reload
- `npm run type-check` - Type check without building

## License

MIT
