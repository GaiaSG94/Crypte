# Persistent wallet — requirements

> **Status: retired on 2026-11-14** (the shop was removed from the product).
> The spec is kept as a trace of the Kiro work; it is **not implemented any
> more** and must not be read as a feature of Crypt.

The shop coins (F6) only ever existed for the current session: quitting the
app erased the earned and the spent coins. This feature kept the wallet
between the sessions, the way the almanac already keeps the tokens per day.
The exchange rate never changes: 1 consumed token = 1 earned coin.

## 1. Balance kept between the sessions

**User story.** As a player of the crypt, I want my coins to survive a
restart, so that I can save up for the big items (holy water, 900 coins)
over several evenings.

- R1. WHEN the app starts AND a valid wallet file exists, THEN THE SYSTEM
  SHALL reload the cumulative earned and spent coins before the shop is
  displayed for the first time.
- R2. WHEN a purchase succeeds, THEN THE SYSTEM SHALL immediately save the
  cumulative earned and spent coins to disk.
- R3. WHEN the app closes normally, THEN THE SYSTEM SHALL save the
  cumulative earned and spent coins to disk.
- R4. WHEN no wallet file exists (first launch), THEN THE SYSTEM SHALL
  start from zero earned and zero spent coins, without error nor message.

## 2. Unreadable or corrupted file

**User story.** As a player, I want the shop to keep working even if its
file is damaged, so that I never lose an evening to a broken JSON.

- R5. WHEN the wallet file is unreadable or invalid, THEN THE SYSTEM SHALL
  restart from zero in memory, never overwrite the faulty file, and report
  the error in `/usage`.
- R6. WHEN a save fails (full disk, permissions), THEN THE SYSTEM SHALL
  keep the in-memory session untouched and report the error in `/usage`,
  without closing nor blocking the shop.

## 3. Several crypts open at once

**User story.** As a player, I want to open two crypts without them erasing
each other's coins.

- R7. WHEN two instances save the wallet, THEN THE SYSTEM SHALL merge by
  keeping the highest cumulates (earned and spent), never overwriting a
  higher cumulate with a lower one.

## 4. Display

**User story.** As a player, I want to see my lifetime totals, to know how
much I have earned and spent since forever.

- R8. WHEN I open `/usage`, THEN THE SYSTEM SHALL display the earned and
  spent coins cumulated over all the sessions, in addition to the current
  balance.
- R9. WHEN I open the shop (F6), THEN THE SYSTEM SHALL display the same
  header as before (balance + earned + spent), the figures becoming the
  lifetime cumulates.

## 5. Non-goals

- No encryption: the coins have no value, unlike the API keys of the
  `/settings` vault.
- No automatic nor manual reset of the cumulates.
- No transfer nor sharing of the wallet between machines.
