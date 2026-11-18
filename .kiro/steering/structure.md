---
inclusion: always
---

# Crypt — structure and conventions

## Size rules (blocking)

- Source file: **500 lines max AND 30 functions max** (tests included;
  count with `grep -cE 'fn [a-zA-Z_][a-zA-Z0-9_]* *\('` for Rust, and
  `grep -cE '^\s*(export )?(async )?function '` for TypeScript).
- Function: **less than 50 lines**.
- Beyond that: split into modules, never let a file grow. Check `wc -l`
  plus the function count on every file you touch before handing off.

## Layout (this repository)

```
src-tauri/            Rust backend (Tauri v2), crate `crypte` (lib `crypte_lib`)
  Cargo.toml          workspace + package manifest (versions live here)
  tauri.conf.json     window, bundle, version
  assets/             pixel art: assets/pixel, assets/hub, assets/haunt
  src/                Rust sources (see below)
src/                  SvelteKit 2 frontend (static SPA, ssr = false)
  routes/             / (chat), /settings, /vps, /haunt, /mbox, /space
  lib/
    contracts.ts      the shapes shared with Rust (single source)
    tauri.ts          invoke/listen wrappers + browser fallback
    fixtures.ts       browser fixtures (dev only, never a secret)
    crypte.svelte.ts  shell state (tabs, fear, overlays, toasts)
    chat/             chat screen: store.ts, ChatView, Sidebar, ChatInput…
    space/            the 3D crypt: scene.ts, layout.ts, state.ts, tabs.ts
    components/       shared widgets (ConnectModal, FearGauge, Header…)
    screens/          Settings, Vps, Haunt views
    mbox/             mailbox panel
    widgets/          design system (CrypteButton, CrypteTabs, …)
    *.css             palette + layout (crypte.css is the palette root)
.kiro/                steering, hooks, agents, skills, specs, workflows
docs/                 design docs, captures, VPS/CLOUD/mbox docs
.github/workflows/    CI (Rust + frontend), release (3 OS), Mergify helpers
```

Rust modules (`src-tauri/src/`): `lib.rs` (wiring), `main.rs`, `state.rs`,
`invoke.rs` / `tauri_more.rs` (commands), `bridge.rs`, `session_chat.rs`,
`drain.rs`, `provider.rs` (OpenAI-compatible client), `settings.rs` +
`vault.rs` (encrypted key store), `permissions.rs` (yolo/auto + fine rules),
`theme.rs` (palette), `creatures.rs` (sprites), `phantom.rs` (mascot),
`fx.rs` (horror overlay), `haunt.rs` + `haunt/` (minigame), `hub.rs` +
`hub/` (spirit hub), `kiro/` (Kiro compatibility engine), `mbox/` (mailbox),
`tools/` (agent tools), `web/` (`/web`), `space/` (3D space backend),
`almanac.rs` (tokens per day), `cli.rs` (headless CLI).

## Conventions

- **Zero duplication**: one implementation per logic; extract and share the
  helpers.
- **Colours only from the palette**: Rust colours live in `theme.rs`
  (`Rgb` constants); CSS colours live in the custom properties of
  `src/lib/crypte.css`. Never hardcode an RGB literal elsewhere.
- **UI and user-facing strings in English.** Code comments may be in any
  language; what the user reads is English.
- **Effects (`fx.rs`, CSS overlays)**: never on the text, never over the
  image areas. No sound at all.
- **Pixel art**: text grids `src-tauri/assets/**/*.txt`, palette letters
  only; scaling is **integer nearest-neighbour** only (`creatures::fit`),
  never a smoothing filter.
- **The 3D space** is driven by a single event contract (`SceneEvent`),
  mirrored between `src/lib/space/types.ts` and
  `src-tauri/src/space/events.rs`. Never invent a second channel.
- **`AGENTS.md`** is read once, pinned in every chat, and excluded from
  compaction.

The full map of the repository is in #[[file:AGENTS.md]].
