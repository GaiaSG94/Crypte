---
inclusion: fileMatch
fileMatchPattern:
  - "src-tauri/src/haunt/**"
  - "src-tauri/src/haunt.rs"
---

# Crypt — Haunt, the F9 game

Original platform/shooter minigame (Kiro fires tokens), level 1 "The
Boneyard" is very hard, 960×576 view, 6 px tiles, creature pixel style.

- **Fixed-step simulation at 240 Hz**: speeds and durations are written
  in 1/30 s reference steps and **always multiplied by `DT` / `SUB`**.
  The screen is redrawn up to 240 times/s; the PNG encoding runs on 3
  threads (`hub/live.rs`, numbered frames, never waiting, never out of
  order).
- Inputs: `a`/`d` (or `←`/`→`), `w` jump 4 tiles, `s` duck (`s`+`w`
  goes through a tile), Space = shoot (2 in flight max), Enter = start /
  put down, `p` pause, `Esc`/F9 = back to the chat (the game runs paused).
- The Kitty keyboard protocol is stacked **only in game** (`app/haunt.rs`);
  everywhere else: halfblocks + key repeat.
- Level = text grid `src-tauri/assets/haunt/niveau-1.txt` (one letter per
  tile, last line = director zones); the tests check that the spider is
  reachable. Sprites = grids of palette letters.
- Look: 32-bit upscale, integer nearest (HiDPI), sky dithered at the
  seams, parallax, fog, vignette.
- Cost of one frame: `cargo test --release --manifest-path src-tauri/Cargo.toml -- --ignored frame_budget --nocapture`.
- After a sprite change: regenerate the shot
  (`cargo run --manifest-path src-tauri/Cargo.toml -- --haunt-shot /tmp/haunt.png`).

In the desktop app the game lives in the `haunt` screen
(`src/routes/haunt/`, `src/lib/screens/HauntView.svelte`): the Rust side
keeps the simulation, the frontend renders the frames.
