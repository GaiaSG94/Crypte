---
inclusion: fileMatch
fileMatchPattern:
  - "src-tauri/assets/**/*.txt"
  - "src-tauri/src/creatures.rs"
  - "src-tauri/src/haunt/sprites.rs"
  - "src-tauri/src/apparition.rs"
  - "src-tauri/src/cmd_creatures.rs"
  - "src/lib/pixel.ts"
---

# Crypt — pixel art and rendering

- Text grids: `src-tauri/assets/pixel/<slug>.txt` = 32 lines of 32
  letters, `.` = transparent, otherwise a palette letter from
  `src-tauri/src/theme.rs` (`W` bone, `S` sand, `U` shade, `K` ink,
  `O`/`o` pumpkin, `R`/`r` blood, `G`/`g` ectoplasm, `P`/`p` spectre,
  `Y`/`y` candle, `N` burlap). Hub sprites: `assets/hub/*.txt`. Game
  sprites: `assets/haunt/*.txt` (mini-sprites 6–18 px, 6 px tiles).
- Guaranteed sharp rendering: **integer** nearest-neighbour scaling on a
  canvas of the exact pixel size (`creatures::fit`) — 1 image pixel = 1
  screen pixel in Kitty, = 1 half-cell in halfblocks. Never a smoothing
  filter (the sharpness is tested: `creatures::tests`,
  `src/lib/pixel.test.ts`).
- In the desktop app the frontend gets PNGs from the backend
  (`creature_get`, `cmd_creatures.rs`); `src/lib/pixel.ts` keeps the
  grid-to-canvas conversion tested on the frontend side too.
- Kiro KO = the `kiro-frappe` sprite flipped (tested); never write inside
  the mascot sprite rectangle, and never apply the horror overlay
  (`fx.rs`) on text or image areas.
- After every sprite touch: regenerate `docs/bestiaire.png`
  (`cargo run --manifest-path src-tauri/Cargo.toml -- --sheet
  docs/bestiaire.png`) and check the render.
