# Persistent wallet — design

> **Status: retired on 2026-11-14** (the shop was removed from the product).
> Kept as a trace of the Kiro work; this design is **not implemented**.

## Overview

A JSON file `wallet.json` in the data folder (same folder as the almanac)
keeps two monotonic cumulates: the coins earned and the coins spent over all
the sessions. At startup the shop loads these cumulates as a base; during
the session, the current earned is base + tokens of the session, the current
spent is base + purchases of the session. Saved after every successful
purchase and at exit.

## Components

- `wallet.rs` (new, pure, tested): the type
  `WalletFile { earned: u64, spent: u64 }`, `load(path)` which returns the
  content plus a possible non-fatal error, `save(path)` in atomic write
  (temporary file + rename, like the vault), and the path of the file from
  the data folder (fallback `~/.local/share/…`, like the almanac).
- `shop.rs` (thin wiring): `Shop` keeps an `earned_base` and a `spent_base`
  loaded at startup; `buy_selected` saves after each successful purchase; no
  rendering change (same header).
- `cmds.rs` (`/usage`, thin wiring): the shop line displays the lifetime
  cumulates, plus the possible loading error.
- `app.rs` (thin wiring): save on the normal exit.

## Data flow

Startup:

```text
wallet.json --load--> (earned_base, spent_base) --> Shop
missing file  --> (0, 0), silence
faulty file  --> (0, 0) in memory, the error kept for /usage,
                 the faulty file is never overwritten
```

Successful purchase and normal exit:

```text
Shop --save--> reads wallet.json back --max(cumulate)--> writes wallet.json
```

The displayed balance is always
`(earned_base + session_tokens) - (spent_base + session_purchases)`,
clamped to zero (never negative).

## Decisions

- D1 — JSON in the data folder, like the almanac: no new format and no new
  dependency, the paths are already established.
- D2 — Two monotonic cumulates rather than a balance: the earned is
  recomputed from the tokens (the almanac is the source of truth), the spent
  can only grow, and merging several instances is a simple max.
- D3 — No encryption: the coins have no value and no confidentiality, the
  encrypted vault stays reserved for the API keys.
- D4 — Save on purchase and at exit, no periodic autosave: the purchases are
  rare and the earned is recomputed; in case of a crash, only the coins
  earned since the last purchase are lost (documented).
- D5 — Merge by max at every save (read before writing, like the almanac):
  two crypts never erase each other.

## Edge cases

- Missing file: silent zeros (R4).
- Invalid JSON, unexpected types, permissions: zeros in memory, faulty file
  preserved, error visible in `/usage` (R5).
- Write failure: unchanged in-memory session, error in `/usage` (R6).
- `u64` overflow: saturating arithmetic everywhere.
- Old session without a base: `earned_base = 0`, the behaviour identical to
  today's during the first migrated session.

## Test strategy

- Unit tests of `wallet.rs`: round-trip load/save, missing file, invalid
  JSON (never overwritten), merge by max — **injected paths only** (a
  temporary folder), never the real data folder nor `set_var`, per the
  `.kiro/` convention of the repository.
- Unit tests of `shop.rs`: balance with a non-zero base, a purchase that
  debits the cumulate, a purchase that is too expensive and does not save.
- Repository checks: `cargo test` green, `cargo fmt --check` clean,
  `--smoke` OK, `wc -l` + `fn` count on the touched files (500 lines /
  30 functions max, functions < 50 lines).
- No new colour: rendering unchanged, `theme.rs` is the only allowed one
  anyway; UI messages in English.

## Repository constraints

- `wallet.rs`: 500 lines max AND 30 functions max, functions < 50 lines;
  `shop.rs` (424 lines today) stays under the thresholds — otherwise split,
  never let it grow.
- Zero duplication: the path of the data folder and the atomic write are
  shared with the existing code, not copied.
- `cargo build` with 0 warning expected.
