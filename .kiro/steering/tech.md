---
inclusion: always
---

# Crypt — technical stack

- **Backend**: Rust 2021, **Tauri v2** (`src-tauri/`), crate `crypte`,
  lib `crypte_lib`. ~75 `#[tauri::command]`s, two event channels
  (`crypte-event`, `crypte-ui`) plus the space channel (`space-event`).
- **Frontend**: **SvelteKit 2** in static SPA mode (`ssr = false`),
  **Svelte 5** runes, Vite, TypeScript strict, **Vitest**, SvelteKit
  adapter-static (`build/`).
- **3D**: **three.js r187** (`src/lib/space/`): scene, world, layout,
  state. The world is driven by the `SceneEvent` contract, shared with
  the Rust side (`src-tauri/src/space/events.rs`).
- **Network**: `reqwest` with rustls, hand-written OpenAI-compatible
  client (`provider.rs`, 60 s timeout), local token estimation with
  `tiktoken-rs`.
- **Encryption**: `chacha20poly1305` (encrypted vault for API keys).
- **Fonts**: `@fontsource/geist-mono` + `@fontsource/geist-sans`, bundled
  (the app works offline).
- **Minimal dependencies**: every cargo feature must be justified in
  #[[file:src-tauri/Cargo.toml]] — do not add a crate or a feature without
  proving it with `grep` + a build, and say why in a comment.

## Commands (everything must be green before handing off)

Run from the **repository root**:

```sh
npm install
npm run check            # svelte-check (types) — 0 errors
npm test                 # vitest
npm run build            # static frontend -> build/
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Rust-only commands can also be run from `src-tauri/` (that is what CI
does). CI additionally enforces a 5-minute budget per job
(`ci-budget`).

Headless CLI of the same binary (no network, no key):

```sh
npm run tauri dev        # desktop app with hot reload
cargo run --manifest-path src-tauri/Cargo.toml -- --smoke
cargo run --manifest-path src-tauri/Cargo.toml -- --sheet out.png
cargo run --manifest-path src-tauri/Cargo.toml -- --apercu out.json
```

## Releases and platforms

- One GitHub Release publishes **the desktop app for the 3 platforms**
  (Windows `.msi`, macOS `.dmg` universal, Linux `.AppImage`) **plus the
  terminal binaries** (Linux/macOS tarballs, built from the branch
  `feat/project-space-3d`).
- The release is triggered by a push on `main` that touches
  `.github/release-request.json` (tag + title in the file), workflow
  `.github/workflows/release.yml`.
- The site (GitHub Pages, branch `gh-pages`) always points to
  `releases/latest`: never hardcode a version number in a link.

## Non-negotiable requirements

- **0 warning** (`cargo clippy -- -D warnings`), **0 failing test**
  (`cargo test` + `npm test`), **`cargo fmt --check` clean**,
  **0 svelte-check error**.
- After touching a sprite: regenerate the sheet and check the game shot.
- Never launch the interactive UI in an incompatible terminal: the
  headless `--smoke` mode is enough to validate a render.
