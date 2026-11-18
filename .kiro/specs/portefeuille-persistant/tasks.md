# Persistent wallet — tasks

> **Status: retired on 2026-11-14** (the shop was removed from the product).
> The tasks below were never checked: the feature was dropped before the
> implementation. Kept as a trace of the Kiro workflow.

- [ ] 1. Create `wallet.rs`: the `WalletFile` type, `load`, the atomic
  `save` and the data-folder path, with unit tests on injected paths.
  Detail: covers the missing file, the invalid JSON never overwritten, the
  merge by max; no write outside the injected path.
- [ ] 2. Add `earned_base` and `spent_base` to the shop and make them the
  base of the displayed balance.
  Detail: balance = (base + session) clamped to zero; the existing shop
  tests stay green.
- [ ] 3. Load the wallet at startup, before the first shop render.
  Detail: missing = silent zeros; faulty = zeros in memory, file preserved,
  error kept for `/usage`.
- [ ] 4. Save after every successful purchase and on the normal exit.
  Detail: read back then merge by max before writing; failure = the
  in-memory session is unchanged.
- [ ] 5. Display the lifetime cumulates and the possible error in `/usage`.
  Detail: UI texts in English, no new colour (`theme.rs` only).
- [ ] 6. Document it in the README (shop section) and in AGENTS.md
  (architecture section).
  Detail: replace the "current session", the `wallet.json` path, the
  multi-instance max rule.
- [ ] 7. Verify: `cargo test` green, `cargo fmt --check`, `--smoke`, the
  500-line / 30-function thresholds on the touched files.
  Detail: build with 0 warning; beyond the thresholds, split, never let it
  grow.
