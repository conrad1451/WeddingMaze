# ADR-007: Progress through 20 levels of growing mazes with fading shortcuts

## Status
- **Status:** Accepted
- **Date:** 2026-09-21 10:33 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
Until `b0c8281` the game was a single fixed 11x11 maze (`MAZE_SIZE = 11`, one "won" flag). The goal was to turn it into a longer game with increasing challenge.
- Feature commit: "Add 20 levels with time-based scoring" (`b0c8281`).
- Larger mazes must still fit on screen, and the stick figure had been drawn for a fixed 40 px cell.

## Decision
We will use **20 levels** (`TOTAL_LEVELS = 20`) with difficulty driven by maze size and the number of shortcuts:
- **Size:** `size = BASE_SIZE (5) + level`, so level 1 is 6x6 and level 20 is 25x25.
- **Loops (shortcuts):** After backtracking (ADR-003), remove `round(size^2 * loopFraction)` randomly chosen interior walls. `loopFraction` starts at 0.12 and drops by 0.01 per level, reaching 0 at level 13.
- **Fit to screen:** `cellSize = min(56, floor(560 / size))` (`MAX_CELL_SIZE`, `MAX_BOARD_PX`). This is 56 px through size 10 (levels 1-5) and shrinks to 22 px at 25x25.
- **Scaled character:** The figure is drawn for a 40 px cell (`BASE_FIGURE_CELL`) and scaled by `cellSize / 40` using non-scaling strokes.
- **Fresh maze per attempt:** `createLevel(n)` generates a new random maze each time a level starts.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Smooth ramp:** Early levels are small and forgiving (extra loops create shortcuts), later ones are large and strictly one-solution.
- **Board always fits:** The board never exceeds 560 px regardless of level.
- **One set of knobs:** Level count, base size, loop fade, and cell limits are constants, so the curve can be re-tuned without code changes.
- **Consistent visuals:** The character scales with the board instead of overflowing small cells.

### Negative (Cons / Trade-offs)
- **Untested curve:** The chosen numbers (0.12, 0.01, 5, 20) are not backed by any playtest data in the repo.
- **Single difficulty axis:** Difficulty comes only from size and loops. Start and goal are always opposite corners.
- **Small late-game cells:** At 22 px the figure is scaled to about 55% of its design size, which may hurt readability on late levels.
- **Random loop removal:** Walls are removed uniformly at random, which can leave open pockets rather than deliberate shortcuts.
- **No replayable levels:** Because mazes are regenerated randomly (unseeded), a level is different every time, so times are not comparable between attempts or players.
