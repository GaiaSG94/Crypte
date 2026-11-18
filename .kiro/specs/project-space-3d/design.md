# Project space 3D — design

The 3D crypt is a **background**, not a screen: the chat stays in front,
the crypt shows what the agents are doing. The full visual spec is
`docs/design/project-space/DESIGN.md` (palette §2, layout §3, panel §4,
caption §5, slabs §6.1, impact §7, camera §8, tabs §11.1). This document
describes the **technical** implementation and the decisions taken while
building it.

## Overview

Three pieces, one contract:

```text
domain events (crypte-event)
        │  derive()            src-tauri/src/space/events.rs
        ▼
SceneEvent  ──emit──▶  space-event channel
        │
        ▼  apply(state, event, now)
SceneState (src/lib/space/state.ts)
        │
        ▼
layout() (src/lib/space/layout.ts)  ──▶  three.js scene (src/lib/space/scene.ts)
```

The frontend never invents an event: it only folds what the backend sends.
This is what makes the TUI branch and the desktop app agree frame by frame.

## The event contract

`SceneEvent` is a union of 16 variants, defined once in TypeScript
(`src/lib/space/types.ts`) and mirrored by the Rust side
(`src-tauri/src/space/events.rs`), serialized in snake_case with a `type`
tag. The two files are kept in sync by a contract test
(`src-tauri/src/space/events.rs::remaining_variants_match_types_ts`).

The variants: `project_open`, `prompt_sent`, `step_start`, `context_load`,
`file_read`, `file_write`, `file_create`, `agent_spawn`, `agent_done`,
`critic_start`, `critic_done`, `checkpoint_saved`, `rewind`, `hub_open`,
`hub_close`.

The Rust side derives them from the domain events
(`space/events.rs::derive`), with one important rule: the derivation never
breaks the chat, even when the log is disabled (`derive_ne_casse_jamais_meme_desactive`).

## Layout

Pure and tested (`layout.ts`, `layout.test.ts`):

- One slab ≈ 150 lines (`LINES_PER_SLAB`), a file is a stack of slabs, a
  folder is a plate.
- Districts are placed on a **bounded arc** (`districtOrigin`): beyond 7
  projects the arc must not go behind the camera, so the districts spread
  sideways and the hub camera pulls back (`hubDistance`, proportional to
  the real footprint).
- The hub target is the centroid of the districts (`layoutCentroid`).

Two properties are now checked by **property-based testing**
(`src/lib/space/layout.pbt.test.ts`, fast-check): two districts never
overlap, and every file of a tree has a position.

## Camera

- **F7** opens the hub: `space.toggleHub()` turns the background on if it
  was off, then applies `hub_open` — one gesture, as in the demo video.
- The camera follows the agent at work and drops on `/rewind`
  (DESIGN §8).
- The labels keep a constant screen size (the perspective never scales
  them): files in Geist Mono 10.5 px, folders in 9.5 px uppercase.

## Palette and rendering

- The space has its own palette (`SPACE_THEME`): `#050505` background,
  `#F5F5F3` foreground, `#FF5B1F` accent (reserved for the file in
  progress).
- The canvas is **transparent** and the CSS paints the black behind it: a
  double sRGB conversion turned the background grey (#232323) during the
  first implementation.
- The lights are multiplied by π (three r155+ uses physical units).
- The bloom is tight: a wide one turned the ghost into a white blob.

## Chat tabs (§11.1 V2.1)

- One tab per open chat, label = the chat name (12 chars max).
- The tabs shrink; the `+` button and the ⌘K hint are never cut.
- The `+N` chip is computed from the real available width, measured with a
  `ResizeObserver` on the tab row — not from a fixed maximum of 4.
- The active tab is always visible: it takes the place of the oldest
  visible tab when it does not fit.
- The logic is pure (`src/lib/space/tabs.ts`) and covered by vitest
  (including the film case: 6 chats in a 360 px panel) and by
  property-based tests (fast-check): the active tab is always visible, the
  shown and hidden counts add up to the total, and what is shown always
  fits.

## Backend

- `space_scan` (one tree), `space_projects` (names), `space_districts` (up
  to 12 districts, active first), `space_attach` / `space_detach`.
- The scan ignores `target`, `node_modules`, `dist`, `build`, `out`,
  `__pycache__`, `vendor`, the hidden directories and the binaries; the
  depth is capped at 32; the text files are counted in lines (8 MB cap).
- No key, no network: the commands only read the local filesystem.

## Demo fallback

When the backend cannot answer (browser dev, backend not ready yet), the
frontend plays the scripted scenario of `src/lib/space/demo.ts`: the ghost
loads the context, reads a file, spawns two sub-agents, writes, gets
judged by Kiro, answers, then opens the hub (F7). Same story as the
prototype `docs/design/project-space/crypt-lab.html`.
