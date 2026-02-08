# Rulebook - Project Overview

You are a senior TypeScript backend engineer and system designer.

We are building a project called **Rulebook**.

Rulebook is an MCP server that manages Markdown-based coding rules and serves them contextually to AI agents during refactoring. It also exposes a web interface for humans to manage these rules.

## TECH STACK
- Language: TypeScript
- Runtime: Node.js
- Framework: **ExpressJS** (chosen for simplicity and clarity)
- Template Engine: **EJS** (server-side rendering)
- Markdown parsing: lightweight, pluggable
- Storage: filesystem-based (no database initially)

### Framework Decision: ExpressJS

**Justification:**
- **Simplicity**: ExpressJS is lightweight and straightforward, aligning with our "favor clarity over cleverness" principle
- **No over-engineering**: For an MVP with simple CRUD operations, ExpressJS provides exactly what we need without unnecessary abstractions
- **Explicit control**: We can maintain clear separation of concerns (domain logic, transport, UI) without framework-imposed structure
- **Faster development**: Less boilerplate means faster iteration for MVP
- **Easy to understand**: The codebase will be more accessible to developers who need to understand or extend it
- **TypeScript support**: ExpressJS works excellently with TypeScript, providing type safety without framework complexity

NestJS would add unnecessary complexity (dependency injection, decorators, modules) for a project that doesn't require enterprise-scale architecture. We can achieve clean separation of concerns through simple folder structure and explicit imports.

## CORE CONCEPTS
- Rules are stored as Markdown (.md) files
- Markdown files may be nested in subfolders
- Each Markdown file **must start with YAML frontmatter** containing metadata:
  - `fileTypes`: array of glob patterns (e.g., `["*.ts", "*.tsx"]`)
  - `folders`: array of folder paths (e.g., `["src/components", "src/utils"]`)
  - `priority`: number (optional, default: 0) - higher priority rules are returned first
- The markdown body (after frontmatter) contains the actual rule content
- Rules are data, not prompts
- The MCP server does NOT refactor code — it only returns applicable rules

**Example Rule File:**
```markdown
---
fileTypes: ["*.ts", "*.tsx"]
folders: ["src/components"]
priority: 5
---

# Component Naming Rules

Components should use PascalCase and be descriptive...
```

## PRIMARY FEATURES (MVP)
1. **MCP Tool API**
   - Tool accepts a list of file paths
   - Tool resolves which Markdown rules apply
   - Tool returns structured rule data for the calling agent

2. **Rule Storage**
   - Rules live on disk as Markdown files
   - Nested folder structure is preserved
   - No database

3. **Web Interface**
   - List all rules (tree view of folders)
   - View a rule (rendered Markdown)
   - Add a new rule
   - Delete a rule
   - Basic validation only

4. **Clear separation between:**
   - Domain logic (rules, matching, metadata)
   - Transport (HTTP, MCP)
   - UI (web interface)

## NON-GOALS (for now)
- Authentication / authorization
- Multi-user support
- Rule enforcement or linting
- AST parsing
- Auto-refactoring
- GitHub sync (planned later)

## ARCHITECTURAL REQUIREMENTS
- Deterministic behavior (same input → same output)
- No hidden magic or heuristics
- Explicit matching logic
- Easy to test
- Designed for future extensibility (e.g. GitHub sync)

## DELIVERABLES
- Project folder structure
- Core domain model for "Rule"
- Rule matching algorithm
- MCP tool definition
- HTTP API for rule management
- Basic web UI (server-rendered with EJS)
- README with setup instructions

## CODING STYLE
- Favor clarity over cleverness
- Explicit types
- No premature abstractions
- No over-engineering
- Comments only where intent is non-obvious

## FIRST STEP
Start by:
1. Proposing the overall architecture
2. ~~Choosing NestJS or ExpressJS (with justification)~~ ✅ **Decision: ExpressJS**
3. Defining the core domain model
4. Sketching the MCP tool interface

Do NOT implement everything at once.
Create a plan with incremental implementation steps
