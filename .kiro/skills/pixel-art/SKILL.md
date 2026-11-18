---
name: pixel-art
description: Add or retouch a 32x32 pixel-art sprite of the creatures (text grids in src-tauri/assets/pixel/*.txt, palette letters, integer scaling). Use for any new monster, sprite retouch, creature sheet regeneration or Kitty rendering.
---

# Pixel art of the creatures

Each creature is ONE text grid `src-tauri/assets/pixel/<slug>.txt`: 32 lines
of 32 letters, `.` = transparent, otherwise a palette letter
(`src-tauri/src/theme.rs`, see README):

- `W` bone, `S` sand, `U` shade, `K` ink
- `O`/`o` pumpkin / dark, `R`/`r` blood / dried
- `G`/`g` ectoplasm / dark, `P`/`p` spectre / dark
- `Y`/`y` candle / dark, `N` burlap

## Imperative rules

1. Exactly 32 lines, exactly 32 characters per line (check with
   `awk '{ print length }' src-tauri/assets/pixel/<slug>.txt | sort -u`).
2. Palette letters and `.` only (no other letter).
3. Colours only through the palette (`src-tauri/src/theme.rs` for Rust, the
   `--cry-*` variables for CSS). No hardcoded RGB elsewhere.
4. **Integer** nearest-neighbour scaling only (`creatures::fit`): never a
   smoothing filter, the sharpness is tested (`creatures::tests`,
   `src/lib/pixel.test.ts`).
5. The mascot KO sprite is the `kiro-frappe` grid flipped (tested); never
   write inside the sprite rectangle.
6. Effects (`fx.rs`, `FxOverlay.svelte`): never on the text, never over the
   image areas. No sound (no BEL).
7. Never copy an original image: every sprite is redrawn.

## After each retouch

```sh
cargo test --manifest-path src-tauri/Cargo.toml                              # green
cargo run --manifest-path src-tauri/Cargo.toml -- --sheet docs/bestiaire.png  # regenerate the sheet
cargo run --manifest-path src-tauri/Cargo.toml -- --smoke                     # headless render, no network, no key
```

Other grids of the same kind (same sharpness rules): the hub sprites
`src-tauri/assets/hub/*.txt`, the game sprites
`src-tauri/assets/haunt/*.txt` (+ `--haunt-shot /tmp/haunt.png` after a
retouch, level `src-tauri/assets/haunt/niveau-1.txt` tested as reachable).
