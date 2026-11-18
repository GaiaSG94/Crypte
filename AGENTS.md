# Crypt — agent context

Crypt is a chat for coding agents in a haunted crypt, as a **Tauri v2
desktop app** (Rust backend + Svelte 5 frontend). The 3D crypt in the
background shows where your agents work. UI and user-facing messages are
**in English**.

The terminal version (`kiro-horror-tui`, ratatui + Ghostty) lives on the
branch `feat/project-space-3d`; this file describes the **desktop app**.

## Commands (from the repository root)

```sh
npm install
npm run check            # svelte-check (types) — 0 error expected
npm test                 # vitest
npm run build            # static frontend -> build/
npm run tauri dev        # desktop app with hot reload

cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Headless CLI of the same binary (no network, no key):

```sh
cargo run --manifest-path src-tauri/Cargo.toml -- --smoke        # self-check
cargo run --manifest-path src-tauri/Cargo.toml -- --sheet out.png # creature sheet
cargo run --manifest-path src-tauri/Cargo.toml -- --apercu out.json
cargo run --manifest-path src-tauri/Cargo.toml -- --mbox <args...> # broadcast CLI
cargo run --manifest-path src-tauri/Cargo.toml -- --events-log f   # JSONL events
```

## Architecture

**Backend** (`src-tauri/src/`): `lib.rs` (wiring), `main.rs`, `state.rs`,
`invoke.rs` + `tauri_more.rs` (commands), `bridge.rs`, `session_chat.rs`,
`drain.rs` (async replies), `provider.rs` (OpenAI-compatible client),
`settings.rs` + `vault.rs` (encrypted key store), `permissions.rs`
(yolo/auto + fine rules), `theme.rs` (palette), `creatures.rs` (sprites),
`phantom.rs` (mascot), `fx.rs` (horror overlay), `haunt.rs` + `haunt/`
(minigame), `hub.rs` + `hub/` (spirit hub), `kiro/` (Kiro compatibility
engine), `mbox/` (mailbox), `tools/` (agent tools), `web/` (`/web`),
`space/` (3D space backend), `almanac.rs` (tokens per day), `cli.rs`.

**Frontend** (`src/`): `routes/` (`/`, `/settings`, `/vps`, `/haunt`,
`/mbox`, `/space`), `lib/contracts.ts` (the shapes shared with Rust),
`lib/tauri.ts` (invoke/listen + browser fallback), `lib/fixtures.ts`
(dev fixtures), `lib/crypte.svelte.ts` (shell state), `lib/chat/` (chat
screen), `lib/space/` (the 3D crypt), `lib/components/`, `lib/screens/`,
`lib/mbox/`, `lib/widgets/`, `lib/*.css` (the palette lives in
`lib/crypte.css`).

**The 3D space** is driven by one contract: `SceneEvent`, defined in
`src/lib/space/types.ts` and mirrored in `src-tauri/src/space/events.rs`.
Everything goes through `apply(state, event, now)` — never a second
channel, never a direct patch of the scene.

**Kiro compatibility**: the app reads the very same `.kiro/` as Kiro
(project `./.kiro/` + global `~/.kiro/`): steering, specs, hooks, MCP,
custom agents, skills, powers, checkpoints, memory. A project moves back
and forth between Crypt and Kiro.

## Conventions

- File: 500 lines max AND 30 functions max (tests included); function < 50
  lines. Beyond that: split into modules, never let a file grow. Check
  `wc -l` and the function count on every file you touch.
- Zero duplication: one implementation per logic, extract and share the
  helpers.
- Colours only through the palette: Rust constants of
  `src-tauri/src/theme.rs`, CSS custom properties of `src/lib/crypte.css`
  (`--cry-*`) and `src/lib/space/space.css` (`--space-*`).
- UI and user-facing strings in **English**. The code and the comments may
  be in any language.
- Effects (`fx.rs`, `FxOverlay.svelte`): never on the text, never over the
  image areas. **No sound** (no BEL, no notification).
- Pixel art: text grids `src-tauri/assets/**/*.txt`, palette letters only;
  scaling is **integer nearest-neighbour** only (`creatures::fit`), never a
  smoothing filter.
- The API key is **never displayed nor logged** (not in the chat, not in a
  log, not in a test). At rest: encrypted vault ChaCha20-Poly1305 (`0600`),
  masked input, master key `master.key` or `KH_SETTINGS_KEY`.
- `.kiro/`: tests through injected paths only (never `set_var`); `KH_KIRO_*`
  = manual binary overrides; in tests, global = `None` (never the real
  `~/.kiro`).
- Pull request: never rebase because `main` moved — `refresh-prs` does it
  (server-side rebase on every push on `main`); a real conflict = label
  `hermes/conflit` + automatic comment, resolved by hand. The merge queue
  is Mergify (squash, update by merge).
