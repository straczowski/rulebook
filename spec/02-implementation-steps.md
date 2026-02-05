# Rulebook - Implementation Steps

This document outlines the concrete, incremental implementation steps for the Rulebook project.

## Phase 1: Foundation & Architecture

### Step 1.1: Project Setup

- Initialize Node.js project with TypeScript
- Set up package.json with dependencies
- Configure TypeScript (tsconfig.json)
- Set up project folder structure
- Add basic tooling (ESLint, Prettier if needed)
- Create initial README.md

### Step 1.2: Framework Selection & Justification

- Evaluate NestJS vs ExpressJS for this use case
- Document decision and justification
- Initialize ExpressJS framework
- Set up basic project structure for ExpressJS
- Add health check route (e.g., `GET /health` or `GET /api/health`) returning `{ status: "ok" }`

**Decision: ExpressJS** ✅

**Justification:**

- **Simplicity**: ExpressJS is lightweight and straightforward, aligning with our "favor clarity over cleverness" principle
- **No over-engineering**: For an MVP with simple CRUD operations, ExpressJS provides exactly what we need without unnecessary abstractions
- **Explicit control**: We can maintain clear separation of concerns (domain logic, transport, UI) without framework-imposed structure
- **Faster development**: Less boilerplate means faster iteration for MVP
- **Easy to understand**: The codebase will be more accessible to developers who need to understand or extend it
- **TypeScript support**: ExpressJS works excellently with TypeScript, providing type safety without framework complexity

NestJS would add unnecessary complexity (dependency injection, decorators, modules) for a project that doesn't require enterprise-scale architecture. We can achieve clean separation of concerns through simple folder structure and explicit imports.

### Step 1.3: Core Domain Model

- Create TypeScript interfaces/types in code (e.g., `src/domain/types.ts` or `src/domain/Rule.ts`)
- Define `Rule` interface/class with:
  - `id`: unique identifier (file path relative to rules directory)
  - `content`: markdown content (body, after frontmatter)
  - `metadata`: frontmatter object (parsed from YAML)
    - `fileTypes`: string[] (e.g., ["*.ts", "*.tsx"])
    - `folders`: string[] (e.g., ["src/components", "src/utils"])
    - `intent`: string (e.g., "refactor", "style", "pattern")
    - `priority`: number (optional, default: 0)
- Define `RuleMetadata` interface
- Create types for rule matching criteria

**Note**: These TypeScript interfaces represent the in-memory structure. The actual rule files are markdown with YAML frontmatter (see format below). Users create rules by writing markdown files with this structure.

**Rule File Format:**

```markdown
---
fileTypes: ["*.ts", "*.tsx"]
folders: ["src/components"]
intent: "refactor"
priority: 5
---

# Rule Title

The actual rule content in markdown format goes here.
Users can write any markdown content below the frontmatter.
```

## Phase 2: Rule Storage & Parsing

### Step 2.1: File System Abstraction

- Create `RuleRepository` interface
- Implement filesystem-based `FileSystemRuleRepository`
- Methods:
  - `listAllRules(): Promise<Rule[]>`
  - `getRuleById(id: string): Promise<Rule | null>`
  - `createRule(id: string, content: string, metadata: RuleMetadata): Promise<Rule>`
  - `deleteRule(id: string): Promise<void>`
  - `updateRule(id: string, content: string, metadata: RuleMetadata): Promise<Rule>`

### Step 2.2: Markdown Parsing

- Choose markdown parser (e.g., `gray-matter` for frontmatter, `marked` or `markdown-it` for rendering)
- Create `MarkdownParser` service
- Parse YAML frontmatter from markdown files (metadata extraction)
- Extract markdown body content (everything after frontmatter)
- Validate frontmatter structure matches `RuleMetadata` interface
- Handle edge cases:
  - Missing frontmatter (use defaults or error)
  - Invalid YAML syntax
  - Missing required fields
  - Invalid field types
- Document the expected frontmatter format for users

### Step 2.3: Rule Directory Structure

- Define rules directory location (e.g., `./rules` or configurable)
- Create initial rules directory structure
- Add example rule files for testing (with proper YAML frontmatter)
  - Example: `rules/typescript/components.md` with frontmatter and content
  - Example: `rules/typescript/naming.md` with different metadata
- Document rule file naming conventions
- Document the YAML frontmatter format and required fields

## Phase 3: Rule Matching Algorithm

### Step 3.1: Matching Logic

- Create `RuleMatcher` service
- Implement `matchRules(filePaths: string[]): Promise<Rule[]>` (via `RuleMatchCriteria`: `filePaths`, optional `intent`)
- Matching criteria:
  - File type matching (glob patterns: `*.ts`, `*.tsx`, etc.)
  - Folder matching (path prefix matching)
  - Intent filtering (if provided)
- Return rules sorted by priority (highest first)

### Step 3.2: Path Matching Utilities

- Create utility functions for:
  - Glob pattern matching (e.g., `minimatch` or custom)
  - Path prefix matching
  - Normalizing paths for comparison
- Add unit tests for matching logic

### Step 3.3: Matching Tests

- Create test fixtures (sample rules, sample file paths)
- Write unit tests for:
  - File type matching
  - Folder matching
  - Multiple rules matching same file
  - Priority sorting
  - Edge cases (empty arrays, no matches, etc.)

## Phase 4: MCP Server Implementation

### Step 4.1: MCP Server Setup

- Install MCP SDK/package
- Create MCP server entry point
- Set up MCP server configuration
- Register MCP tool: `get_applicable_rules`

### Step 4.2: MCP Tool Definition

- Define tool schema:
  - Name: `get_applicable_rules`
  - Description: Returns applicable rules for given file paths
  - Parameters:
    - `filePaths`: string[] (required)
    - `intent?`: string (optional filter)
  - Returns: Array of rule objects with `id`, `content`, `metadata`

### Step 4.3: MCP Tool Implementation

- Implement tool handler
- Integrate with `RuleMatcher`
- Format response according to MCP spec
- Add error handling
- Test MCP tool via MCP client

## Phase 5: HTTP API

### Step 5.1: API Structure

- Set up HTTP server with Express
- Configure EJS template engine: `app.set('view engine', 'ejs')`
- Set views directory for EJS templates
- Define API routes:
  - `GET /api/rules` - List all rules
  - `GET /api/rules/:id` - Get single rule
  - `POST /api/rules` - Create new rule
  - `PUT /api/rules/:id` - Update rule
  - `DELETE /api/rules/:id` - Delete rule
  - `POST /api/rules/match` - Match rules for file paths (for testing)

### Step 5.2: API Implementation

- Implement each route handler
- Add request validation
- Add error handling middleware
- Return appropriate HTTP status codes
- Add response DTOs/types

### Step 5.3: API Testing

- Create API integration tests
- Test all endpoints
- Test error cases
- Document API endpoints (OpenAPI/Swagger optional)

## Phase 6: Web Interface

### Step 6.1: UI Framework Decision

- Choose approach: **Server-side rendering** ✅
- Choose template engine: **EJS** ✅

**Decision: Server-side rendering with EJS**

**Justification:**

- **EJS (Embedded JavaScript)** is the lightest-weight option that still provides flexibility
  - Simple syntax: plain HTML with embedded JavaScript (`<% %>` tags)
  - Minimal dependencies and setup
  - Fast performance
  - Allows JavaScript logic in templates when needed
  - Easy to learn and maintain
  - Native Express.js support
- **Alternatives considered:**
  - **Mustache**: Even lighter (logic-less), but too restrictive for MVP needs
  - **Handlebars**: Similar weight, but logic-less philosophy adds complexity
  - **Pug**: More features but heavier and unnecessary for MVP
- **Why not SPA**: Server-side rendering is simpler for MVP, no build step, easier to iterate

**Implementation**: Use `ejs` package with Express `app.set('view engine', 'ejs')`

### Step 6.2: Rule List View

- Create EJS template for rule list view
- Create Express route handler for list page
- Display folder structure (tree view)
- Show rule count per folder
- Add navigation to view individual rules
- Style with basic CSS

### Step 6.3: Rule View Page

- Create EJS template for single rule view
- Create Express route handler for rule detail page
- Render markdown content (use markdown renderer)
- Display metadata in readable format
- Add "Edit" and "Delete" buttons
- Add "Back to list" navigation

### Step 6.4: Rule Creation/Editing

- Create EJS template for rule creation/editing form
- Create Express route handlers (GET for form, POST/PUT for submission)
- Create form/editor for new rule
- **Option A (Form-based)**: Separate fields for:
  - File path/name (for rule location)
  - Metadata fields (fileTypes, folders, intent, priority) - generates YAML frontmatter
  - Markdown content (textarea for body)
  - Preview the full markdown with frontmatter before saving
- **Option B (Raw editor)**: Single textarea showing full markdown file with frontmatter
  - Syntax highlighting for YAML frontmatter and markdown
  - Validation of frontmatter structure
- Add validation (frontmatter structure, required fields)
- Submit to API (server parses frontmatter and validates)
- Handle success/error feedback

**Recommendation**: Start with Option A (form-based) for better UX, allow switching to raw editor for advanced users.

### Step 6.5: Rule Deletion

- Add delete confirmation dialog
- Call DELETE API
- Refresh list after deletion
- Handle errors

## Phase 7: Integration & Polish

### Step 7.1: Configuration

- Add configuration file (e.g., `config.json` or environment variables)
- Configurable rules directory path
- Configurable server port
- Configurable MCP server settings

### Step 7.2: Error Handling

- Add comprehensive error handling
- User-friendly error messages
- Logging setup (console or file-based)
- Handle edge cases gracefully

### Step 7.3: Documentation

- Update README.md with:
  - Setup instructions
  - Configuration options
  - API documentation
  - Rule file format documentation
  - MCP server setup instructions
- Add example rule files
- Document matching algorithm behavior

### Step 7.4: Testing

- Unit tests for core domain logic
- Integration tests for API
- End-to-end test for MCP tool
- Manual testing of web UI

## Phase 8: MVP Completion

### Step 8.1: Final Integration

- Ensure all components work together
- Test full workflow:
  - Create rule via web UI
  - Query via MCP tool
  - Verify matching works correctly
  - Delete rule via web UI

### Step 8.2: Code Quality

- Code review and refactoring
- Remove any dead code
- Ensure type safety throughout
- Verify no console.logs in production code

### Step 8.3: Deployment Preparation

- Add startup script
- Document deployment process
- Create example configuration
- Test in clean environment

## Implementation Order Summary

1. **Foundation** (Steps 1.1-1.3): Project setup, framework choice, domain model
2. **Core Logic** (Steps 2.1-3.3): Storage, parsing, matching
3. **MCP Server** (Steps 4.1-4.3): MCP tool implementation
4. **HTTP API** (Steps 5.1-5.3): REST endpoints
5. **Web UI** (Steps 6.1-6.5): User interface
6. **Polish** (Steps 7.1-8.3): Configuration, docs, testing, final integration

Each phase should be completed and tested before moving to the next.