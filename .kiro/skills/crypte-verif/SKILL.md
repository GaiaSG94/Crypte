---
name: crypte-verif
description: Verify Crypt without network or key (headless smoke test, Rust tests, frontend types, vitest, build) and check the release bundle. Use before any commit, after a visual change, or to ship a binary.
---

# Verification and release of Crypt

All commands run **from the repository root**.

## Headless smoke test (no network, no key)

```sh
npm install
npm run check            # svelte-check (types) — 0 error
npm test                 # vitest
npm run build            # static frontend -> build/
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
cargo run --manifest-path src-tauri/Cargo.toml -- --smoke        # headless render, no network, no key
cargo run --manifest-path src-tauri/Cargo.toml -- --sheet out.png # creature sheet
cargo run --manifest-path src-tauri/Cargo.toml -- --apercu out.json
```

After a visual change, add the regeneration command covered by the
`pixel-art` skill (`--sheet`, `--haunt-shot`).

## File rules (recall of AGENTS.md)

- File: 500 lines max AND 30 functions max (tests included).
- Function: under 50 lines. Beyond that: split, never let it grow.
- Check: `wc -l` plus `grep -cE 'fn [a-zA-Z_][a-zA-Z0-9_]* *\('` on every
  file touched. Zero duplication (shared helpers).
- UI and messages in English; the API key is never displayed nor logged.
- Colours through the palette only (`src-tauri/src/theme.rs`,
  `src/lib/crypte.css`).

## Release

The release workflow (`.github/workflows/release.yml`) publishes the desktop
app for the three platforms (Windows `.msi`, macOS `.dmg`, Linux
`.AppImage`) plus the terminal binaries, on a push to `main` that touches
`.github/release-request.json` (tag + title in the file). To request one:

```json
{ "tag": "v1.0.3", "status": "pending", "comment": "..." }
```

The site (GitHub Pages, branch `gh-pages`) always points to
`releases/latest`: never hardcode a version number in a link.

Local check of the terminal build (branch `feat/project-space-3d`):

```sh
cargo build --release --manifest-path src-tauri/Cargo.toml
```
