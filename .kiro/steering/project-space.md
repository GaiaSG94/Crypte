---
inclusion: fileMatch
fileMatchPattern:
  - "src/lib/space/**"
  - "src-tauri/src/space/**"
---

# Crypt — the 3D project space (F7 / F8)

The 3D crypt is the signature feature: your projects are districts, your
folders are plates on the floor, your files are stacks of slabs, and the
ghost flies to whatever the agent touches.

Design reference: `docs/design/project-space/DESIGN.md` (§2 palette,
§3 layout, §6.1 slab size, §7 impact, §8 camera, §11.1 chat tabs).

## The event contract is the law

- `SceneEvent` (union of 16 variants) is defined **once** in
  `src/lib/space/types.ts` and mirrored by the Rust side in
  `src-tauri/src/space/events.rs` (serde, snake_case, `type` tag).
- Everything that reaches the scene goes through that channel
  (`space-event`). Never add a second channel, never patch the scene
  from a component: `apply(state, event, now)` is the only writer.
- The Rust side derives the events from the domain events
  (`space/events.rs::derive`), the frontend only folds them.

## Layout rules

- One slab ≈ 150 lines (`LINES_PER_SLAB`); a file is a stack of slabs,
  a folder is a plate (`layout.ts`: `SLAB`, `ROW_PITCH`, `COL_GAP`).
- The layout is **pure and tested** (`layout.test.ts`): districts are
  placed in a bounded arc, the hub camera distance follows the real
  footprint (`hubDistance`), and two districts never overlap.
- The active project is index 0; the neighbours are the other workspaces
  (`space_districts`, `MAX_DISTRICTS`).

## Palette and light

- The space has its own palette (`SPACE_THEME`): background `#050505`,
  foreground `#F5F5F3`, accent `#FF5B1F` (orange is reserved for the
  file in progress and for the active project frame).
- Render on a transparent canvas with a CSS background behind it: a
  double sRGB conversion turns the background grey.
- Light intensities are multiplied by π (three r155+ uses physical
  units).
- Labels keep a **constant screen size** (files 10.5 px mono, folders
  9.5 px uppercase), never scaled by the perspective.

## Chat tabs (§11.1 V2.1)

- One tab per open chat, label = chat name (12 chars max, ellipsis).
- Tabs shrink (`min-width: 0`); the `+` button and the ⌘K hint are never
  cut.
- The `+N` chip is computed from the **real available width**
  (`ResizeObserver`), never from a fixed maximum.
- The active tab is always visible; if it does not fit, it takes the
  place of the oldest visible tab.
- The logic is pure in `src/lib/space/tabs.ts` and covered by vitest
  (6 chats in a 360 px panel).

## Backend

- `space_scan` (one tree), `space_projects` (names),
  `space_districts` (up to 12 districts, active first), `space_attach` /
  `space_detach` (subscribe to the events).
- The scan ignores `target`, `node_modules`, `dist`, `build`, `out`,
  `__pycache__`, `vendor`, hidden directories and binaries; depth is
  capped at 32; text files are counted in lines (8 MB cap).
