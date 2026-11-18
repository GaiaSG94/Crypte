---
inclusion: fileMatch
fileMatchPattern:
  - "src-tauri/src/kiro/**"
---

# Crypt — the `.kiro/` compatibility engine

Crypt reads the very same `.kiro/` as Kiro (project `./.kiro/` plus the
global `~/.kiro/`, complete T1→T5): steering (`steering.rs`), specs
(`spec.rs`, `spec_prompts.rs`, `spec_runner.rs`; `/spec new` = 3 chained
calls requirements → design → tasks, `run` through sub-agents), hooks
(`hooks.rs`, `hook_match.rs`, `hook_run.rs`, `hook_exec.rs`: trigger +
regex `matcher` + `.kiroignore`; `command` = `sh -c` async 30 s, `agent`
= prompt prefixed to the next message), MCP (`mcp*.rs`: tools only,
`mcp_<server>_<tool>`), custom agents (`agents_md.rs`, `agents_parse.rs`:
official Kiro format `.json`/`.md`, `team/<name>`, project beats global,
json beats md; `tools`/`mcpServers` are read and displayed, not executed),
skills (`skills.rs`: `/skill` is transient), powers (`powers.rs`),
checkpoints (`checkpoint.rs`, ring of 20 via `write_tracked`), memory
(`memory.rs`, pinned after the steering).

## Strict test rules

- **Injected paths only**: never `set_var` (single historical site,
  `spec_bout_en_bout`, fixture without steering nor MCP).
- `KH_KIRO_*` = manual binary overrides only.
- In tests: global = `None` by default (never the real `~/.kiro`).
- `always` steering + memory merged into the pinned agents.md
  (see `agents::load_merged_in`); `.kiroignore`: the last matching
  pattern wins, `!` re-includes, `dir/` = subtree.
- Existing specs are never overwritten; a failed task stops the run, no
  retry; boot hook = single-fire, anti-recursion guard of depth 1.

Because Crypt implements this engine, **the `.kiro/` directory of this
repository is read by the product itself**: keep the formats valid
(front matter, trigger names, matcher regexes) and the commands runnable
from the repository root.
