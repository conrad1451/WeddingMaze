# ADR-009: Model game flow as an explicit phase state machine

## Status
- **Status:** Accepted
- **Date:** 2026-09-21 10:33 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
The game originally had a single `won` boolean (`70f6c18`). Multi-level play (ADR-007) introduces a start screen, active play, a between-level summary, and a final results screen. Timers, input listeners, and completion checks must only run at the right times.
- Implemented in `b0c8281` with a new `Phase` type in `dataTypes.ts`.

## Decision
We will represent flow as `Phase = 'start' | 'playing' | 'levelComplete' | 'gameComplete'`, held in React state, and gate behaviour on it:
- **Input:** Keyboard listeners (ADR-004) attach only while `phase === 'playing'`.
- **HUD timer:** A 100 ms interval updates elapsed time only while playing.
- **Completion:** An effect detects the player reaching the goal, records a `LevelResult`, and moves to `levelComplete`, or to `gameComplete` after the last level.
- **Level start:** `startLevel(n)` builds a new `LevelData` via `createLevel(n)`, resets position, and starts the clock. Refs (`levelRef`, `startTimeRef`) mirror values that handlers need without stale closures.
- **UI:** The start, level-complete, and game-complete screens are full-screen overlay panels with an auto-focused primary button. A restart control returns to `start`.
- **Results:** A `LevelResult[]` accumulates per-level time and points.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Fewer impossible states:** A single phase value replaces combinations of booleans, so the game cannot be "won" and "playing" at once.
- **Input is inert outside play:** Listeners and timers are cleaned up automatically when the phase changes.
- **Clear extension points:** Adding a phase (for example, a pause) means one new union member and one new effect/branch.
- **Keyboard-friendly overlays:** `autoFocus` on the overlay buttons lets players continue with Enter or Space.

### Negative (Cons / Trade-offs)
- **Concentrated in one component:** Phase logic, effects, refs, and every overlay screen live in `MazeGame.tsx` (see ADR-006).
- **Refs mirror state:** `levelRef` and `mazeRef` duplicate state to avoid stale closures, which must be kept in sync by hand.
- **No persistence:** A page refresh returns to the start screen and discards progress.
- **Effect coupling:** The completion effect depends on `playerPos`, `phase`, `level`, and `levelData`, so changes to any of them need care to avoid double-recording a result.
