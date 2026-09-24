# ADR-008: Score each level by solve time against a par derived from the shortest path

## Status
- **Status:** Accepted
- **Date:** 2026-09-21 10:33 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
With multiple levels (ADR-007) the game needs a score that rewards speed and scales with maze size.
- Introduced in `b0c8281`: "Score each level by solve time against a par derived from the shortest path (BFS): full points at or under par, decaying to a 10% floor. Later levels are worth more."
- Maze size, loops, and randomness mean a fixed per-level time limit would not fit every generated maze.

## Decision
We will compute a **par time from the actual maze** and score against it:
- **Shortest path:** `shortestPathLength` runs a breadth-first search from (0,0) to the far corner, measured after loops are added.
- **Par:** `parSeconds = 3 + 0.3 * shortestPath` (`PAR_BASE_SECONDS`, `PAR_SECONDS_PER_STEP`).
- **Points:** `maxPoints = 400 + 100 * level` (500 at level 1, 2,400 at level 20; 29,000 total across all 20 levels). At or under par earns full points. Over par, `factor = max(0.1, 1 - overPar / (par * 4))`, then `round(maxPoints * factor)`. Finishing is always worth at least 10%.
- **Timing:** The timer starts when the maze appears (`performance.now()` stored in a ref). The HUD refreshes every 100 ms, but the recorded result is computed from the ref at the moment the goal is reached.
- **Feedback:** The HUD shows time, par, points currently available, and running total; a results table (level, time, points) appears at the end.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Fair across mazes:** Par adapts to each generated maze's real shortest path, so unlucky layouts are not penalized.
- **Achievable par:** Par allows 0.3 s per step, while the input rate limit (ADR-004) allows a step every 0.11 s, so full points are reachable without perfect play.
- **Always some reward:** The 10% floor means completing a level always scores something.
- **Accurate timing:** The final time does not depend on the 100 ms HUD refresh.
- **Later levels matter more:** The rising `maxPoints` rewards progress.

### Negative (Cons / Trade-offs)
- **Decay constant does not match its name (observation):** `DECAY_PAR_MULTIPLES = 4` suggests the floor is reached four pars over par, but with the 0.1 floor the formula hits it at 3.6 pars over.
- **Scores are not persisted:** Results live in component state only, so they are lost on refresh or restart, and there is no leaderboard.
- **Client-side scoring:** Timing and points are calculated in the browser and could be manipulated, which is acceptable only if scores are not competitive or prized.
- **Speed-only objective:** The score ignores steps taken or wrong turns, only elapsed time.
- **Tuning is guesswork:** The base points, per-step time, and decay have no recorded basis beyond the initial choice.
