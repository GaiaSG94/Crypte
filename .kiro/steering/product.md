---
inclusion: always
---

# Crypt — product context

**Crypt** is a chat for coding agents in a haunted crypt. The desktop app
(Tauri v2 + Svelte 5) shows **where your agents work**: your projects are
drawn as a 3D crypt in the background, folders are plates on the floor,
files are stacks of slabs, and the ghost flies to whatever it touches.

The desktop app is the product judges install. A terminal version
(`kiro-horror-tui`, ratatui + Ghostty) ships the same crypt, software
rendered, on the branch `feat/project-space-3d`.

UI and user-facing messages are **always in English**.

## What the product is

- **Multi-chat LLM client** (OpenAI-compatible providers), one model per
  chat, global reasoning level.
- **The 3D project space** (F7 / F8): every project you run is a district
  of the crypt. F7 pulls the camera back over all of them, F8 toggles the
  background.
- **Kiro the mascot ghost**: haunts the chat panel and criticises your
  prompts; click to hit him.
- **Apparitions** reacting to the chat (cauldron, spider, tomb hand),
  horror effects (warm vignette, fog, lightning), a **fear gauge**
  (`fear`, % of the model context window), a **global** token counter.
- **Haunt** (F9): an original platform/shooter minigame, pixel art.
- **Sub-agents** `/agent`, inter-chat bus (`/tell`, `/msg`, `/link`),
  compaction `/compact`, web search `/web`.
- **Kiro compatibility**: Crypt reads the very same `.kiro/` as Kiro
  (steering, specs, hooks, MCP, custom agents, skills, memory) — a project
  moves back and forth between the two.

## What the product is not

- No sound: never a BEL, never a notification.
- Not an IDE: no file editing, no embedded terminal.
- The app starts **without a key and without network**: Haunt, the 3D space
  and the demo mode work offline (`/connect` adds a provider later).

Reference: #[[file:README.md]]
