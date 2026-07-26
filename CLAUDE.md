# Claude Code instructions

The shared, tool-agnostic rulebook for this repo lives in `AGENTS.md` - project overview, stack,
brand, design, architecture, git conventions, writing style, and collaboration expectations. Codex
and Cursor read that file natively; Claude Code pulls it in via the import below. **Edit shared
rules in `AGENTS.md`, not here.** This file holds only Claude-Code-specific operating notes.

@AGENTS.md

## Claude-Code-specific notes

- **Sub-agents and worktrees:** when spawning sub-agents for complex tasks, pass
  `isolation: "worktree"` to the Agent tool so each sub-agent gets its own auto-managed worktree.
  See the Worktree Convention section in `AGENTS.md` for the human-facing workflow.
- **Persistent memory:** a file-based memory index is loaded each session from the memory directory.
  Treat recalled memories as background context, and verify any file, function, or flag they name
  still exists before acting on it.
