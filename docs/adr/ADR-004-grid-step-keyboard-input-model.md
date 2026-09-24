# ADR-004: Use discrete, rate-limited grid steps with a held-key stack for keyboard input

## Status
- **Status:** Accepted
- **Date:** 2026-09-21 04:30 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
The player moves one cell at a time through a wall-based grid using the keyboard.
- The original input loop (`70f6c18`) stored pressed keys in a map and polled it every 50 ms. Simultaneous keys could move the player diagonally, and diagonal steps could clip through wall corners. The win check also ran as a side effect inside the `setPlayerPos` updater.
- `2f6ade9` replaced this with a new model and moved win detection into an effect.
- Related: arrow keys scrolled the page, and keys could stay "stuck" if the window lost focus mid-press.

## Decision
We will handle input with these rules:
- **One axis per step:** each move is a single cell in one of four directions (`move(direction)`), checked against the current cell's wall flags.
- **Held-key stack:** the most recently pressed direction wins; releasing it falls back to the previous held key.
- **Rate limit:** at most one step per `MOVE_DELAY_MS` (110 ms). A `setInterval` at 20 ms repeats the step while a key is held, and a fresh key press steps immediately.
- **Key mapping:** arrow keys and WASD via `KEY_TO_DIRECTION`.
- **Housekeeping:** `preventDefault()` on mapped keys, ignore `e.repeat`, and clear held keys on window `blur`.
- **Wall lookup:** `move` reads the maze from a ref (`mazeRef`/`levelRef`) so the listeners do not need to resubscribe when the maze changes. The `setPlayerPos` updater stays pure.

Listeners are only attached while the game phase is `playing` (see ADR-009).

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Correct collisions:** Single-axis steps eliminate diagonal wall clipping.
- **Consistent pace:** Movement speed is set by `MOVE_DELAY_MS`, not by the OS key-repeat rate.
- **Robust input:** No page scrolling from arrow keys, no stuck keys after focus loss, and the newest key press always takes effect.
- **Pure state updates:** Side effects are outside the state updater, which is safer under React StrictMode (enabled in `main.tsx`).

### Negative (Cons / Trade-offs)
- **Keyboard only:** There are no touch or on-screen controls, so the game is not playable on phones or tablets as written.
- **Global key capture:** Listeners are on `window`, so while playing, mapped keys (including W/A/S/D) are intercepted page-wide.
- **Constant polling while playing:** A 20 ms interval runs for the whole playing phase.
- **Tuned by feel:** 110 ms and 20 ms are hand-picked constants with no recorded rationale beyond responsiveness. They also set a floor on how fast a level can be completed (see ADR-008).
