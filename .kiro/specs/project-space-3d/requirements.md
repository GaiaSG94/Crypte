# Project space 3D — requirements

The 3D crypt is the signature feature of Crypt: **see where your agents
work**. Every project the user runs is drawn as a district of the crypt in
the background of the chat, folders are plates on the floor, files are
stacks of slabs, and the ghost flies to whatever the agent touches.

This spec is the live example of the Kiro workflow in this repository: the
requirements are written in EARS, the design mirrors the implementation, and
the tasks point at the merged pull requests.

- **Feature branches**: `feat/space-tauri` → `main`
- **Merged pull requests**: #147 (the 3D background), #154 (the Rust side
  of the space merged into main), #160 (F7 shows every project), #165 (the
  chat tabs of the panel), #170 (the chat tabs V2.1)
- **Design reference**: `docs/design/project-space/DESIGN.md`

## 1. The scene is driven by one event contract

**User story.** As a developer, I want the 3D crypt to reflect exactly what
my agents did, so that I can read their work at a glance.

- R1. WHEN the backend derives a domain event (prompt sent, file read,
  file written, agent spawned or done, critic, checkpoint, rewind), THEN
  THE SYSTEM SHALL emit the matching `SceneEvent` on the `space-event`
  channel.
- R2. WHEN the frontend receives a `SceneEvent`, THEN THE SYSTEM SHALL
  fold it into the scene state through `apply(state, event, now)` and
  through no other path.
- R3. WHEN a `SceneEvent` crosses the bridge, THEN THE SYSTEM SHALL keep
  the same field names and the same snake_case JSON shape on both sides
  (Rust `src-tauri/src/space/events.rs`, TypeScript
  `src/lib/space/types.ts`).

## 2. Turning the 3D crypt on and off

**User story.** As a user, I want the crypt to stay out of my way, and one
keystroke to bring it back.

- R4. WHEN the user presses F8, THEN THE SYSTEM SHALL toggle the 3D
  background on and off.
- R5. WHEN the 3D background is off, THEN THE SYSTEM SHALL render the chat
  exactly as before (no WebGL cost, no layout change).
- R6. WHEN the 3D background is on, THEN THE SYSTEM SHALL show the chat
  panel as a glass panel, with the 3D crypt visible through and around it.

## 3. F7: every project, not only the current one

**User story.** As a user with many projects, I want one keystroke to see
all of them, so that I understand the whole workspace.

- R7. WHEN the user presses F7 and the 3D background is off, THEN THE
  SYSTEM SHALL turn the background on and open the hub view in the same
  gesture.
- R8. WHEN the hub view is open, THEN THE SYSTEM SHALL draw every project
  found in the workspaces (the active one first, then the repositories of
  `KH_SPACE_WORKSPACES` and of `~/code`), up to 12 districts.
- R9. WHEN the number of projects exceeds the frame of the hub, THEN THE
  SYSTEM SHALL scale the camera distance with the real footprint of the
  districts instead of cutting them.
- R10. WHEN the hub view is open, THEN THE SYSTEM SHALL let the user close
  it with the same key.

## 4. The crypt draws the project

**User story.** As a user, I want my project to look like a crypt, so that
I can see its structure and its activity at a glance.

- R11. WHEN a project is opened, THEN THE SYSTEM SHALL draw its folders as
  plates on the floor and its files as stacks of slabs, one slab for about
  150 lines.
- R12. WHEN the layout is computed, THEN THE SYSTEM SHALL place the two
  districts never on top of each other and give every file a position.
- R13. WHEN the file in progress changes, THEN THE SYSTEM SHALL mark it in
  orange (the only reserved colour) and keep the label at a constant
  screen size.

## 5. The chat tabs of the panel

**User story.** As a user running several chats, I want one tab per chat,
so that I can switch without leaving the 3D view.

- R14. WHEN the 3D background is on, THEN THE SYSTEM SHALL show one tab
  per open chat, labelled with the chat name (12 characters max, ellipsis).
- R15. WHEN the panel is too narrow for all the tabs, THEN THE SYSTEM
  SHALL shrink them, keep the `+` button and the ⌘K hint visible, and show
  the hidden chats behind a `+N` chip computed from the **real available
  width**.
- R16. WHEN the active chat is not visible, THEN THE SYSTEM SHALL make it
  visible by taking the place of the oldest visible tab.
- R17. WHEN the user clicks a tab, THEN THE SYSTEM SHALL select that chat;
  WHEN the user middle-clicks it, THEN THE SYSTEM SHALL close it.

## 6. Offline and without a key

**User story.** As a judge who installs the app without any API key, I want
to see the crypt working, so that I can judge the feature.

- R18. WHEN the app starts without a provider connected, THEN THE SYSTEM
  SHALL still answer the `space_districts` and `space_scan` commands (they
  only read the local filesystem).
- R19. WHEN the backend cannot answer, THEN THE SYSTEM SHALL fall back to
  the scripted demo scene (`src/lib/space/demo.ts`) instead of an empty
  crypt.
- R20. WHEN the demo mode is running, THEN THE SYSTEM SHALL replay the
  scenario (the ghost reads, spawns two sub-agents, writes, gets judged,
  then F7) so that the feature is visible without a key.

## 7. Non-goals

- No editing of the files from the 3D view (read-only visualisation).
- No remote filesystem: only the local workspaces.
- No sound (the crypt is silent, like the rest of the app).
