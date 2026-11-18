---
inclusion: manual
---

# Crypt — Ghostty launcher and VPS (terminal branch)

Scope: the terminal version of Crypt (`kiro-horror-tui`), which lives on
the branch `feat/project-space-3d` of this repository. The desktop app
(Tauri) does not use the launcher.

Reference with `#ghostty-launcher` when touching the launch experience
or the VPS features of the terminal build.

- `ghostty/crypte`: runs the TUI in place if the terminal can host the
  crypt (interactive TTY, truecolor, ≥ 80x24), otherwise opens a dressed
  Ghostty window (theme + shader, release build if needed). `--window`
  forces the window; `--help`, `--smoke`, `--once`, `--sheet`,
  `--preview` always run in place. If truecolor is not announced:
  `export COLORTERM=truecolor`.
- `ghostty/crypte rebuild …`: syncs the latest `origin/main` into a
  dedicated worktree `<name>-latest`, forces a release build, then
  launches it with the remaining args. The current checkout is never
  touched (a dirty tree is fine; only a dirty generated worktree
  refuses).
- `ghostty/crypte.conf` (palette, wide padding, 120x36) +
  `ghostty/crypte.glsl` (static vignette — no blur: every pixel is read
  at its own place). Ghostty features used: Kitty graphics, truecolor,
  integrated sprites, OSC 11 / OSC 2 / OSC 9;4 (native progress), mode
  2026 (synchronized rendering).
- VPS + live event stream: #[[file:docs/VPS.md]]; live JSONL stream via
  `--events-log` / `KH_EVENTS_LOG` (chats + sub-agents, silent when
  disabled). VPS profiles: `~/.config/kiro-horror-tui/vps.toml`.
