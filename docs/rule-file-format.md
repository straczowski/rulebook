# Rule File Format

Rulebook stores rules as Markdown files with YAML frontmatter. Each file must start with a valid frontmatter block; the rest of the file is the rule content (markdown body).

## File Location and Naming

- **Location**: Rule files live under the rules directory (default: `./rules`, configurable via `RULES_DIRECTORY`).
- **Structure**: You can organize rules in subfolders (e.g. `rules/typescript/components.md`). The folder path becomes part of the rule ID.
- **Extension**: Use `.md` for rule files. Only `.md` files are scanned.
- **Naming**: Use descriptive, kebab-case names (e.g. `component-naming.md`, `error-handling.md`). The rule ID is the path relative to the rules directory (e.g. `typescript/components.md`).

## YAML Frontmatter

Frontmatter must be the first thing in the file, between `---` delimiters.

### Required Fields

| Field       | Type     | Description |
|------------|----------|-------------|
| `fileTypes` | string[] | Glob patterns for file types this rule applies to (e.g. `["*.ts", "*.tsx"]`). |
| `folders`   | string[] | Folder paths this rule applies to (e.g. `["src/components", "src/utils"]`). Path prefix matching is used. |

### Optional Fields

| Field     | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `priority` | number | 0       | Higher values are returned first when multiple rules match. |

### Example

```yaml
---
fileTypes: ["*.ts", "*.tsx"]
folders: ["src/components"]
priority: 5
---
```

### Validation

- `fileTypes` and `folders` must be non-empty arrays of strings.
- `priority` must be a number if present.
- Invalid or missing required fields cause the file to be rejected when loading rules.

## Body Content

Everything after the closing `---` is the rule content. Use normal Markdown (headings, lists, code blocks, etc.). This content is what is served to the AI agent when the rule matches.

## Full Example

```markdown
---
fileTypes: ["*.ts", "*.tsx"]
folders: ["src/components"]
priority: 5
---

# Component Naming Rules

Components should use PascalCase and be descriptive.
```

See `rules/typescript/components.md` and `rules/typescript/naming.md` in the repository for more examples.
