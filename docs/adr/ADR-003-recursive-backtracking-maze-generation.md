# ADR-003: Generate mazes with recursive backtracking over the full grid

## Status
- **Status:** Accepted
- **Date:** 2026-09-21 04:30 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
Each level needs a random maze in which the goal is always reachable from the start.
- The first version (`70f6c18`) carved the full 11x11 grid starting at (1,1), but clamped player movement to indices 1..9 and manually knocked out an "entrance" and "exit" wall. Because carving covered the border cells too, the only route to the goal at (9,9) could pass through cells the player was not allowed to enter.
- `2f6ade9` fixed this ("Generate the maze over the full grid and start at (0, 0), so the goal in the far corner is always reachable").
- The same commit replaced `sort(() => Math.random() - 0.5)` with a Fisher-Yates shuffle (`shuffle.ts`), noted in the code as unbiased, and removed `visited` from the `Cell` state.
- Sizing was later parameterized (`generateMaze(size, loopFraction)` in `b0c8281`); extra loops are covered in ADR-007.

## Decision
We will generate each maze using **recursive backtracking (randomized depth-first search) over the entire `size x size` grid**, starting at (0, 0), with the goal at (size-1, size-1). Neighbour order is randomized with a **Fisher-Yates shuffle**.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Guaranteed solvable:** Carving visits every cell, so the far-corner goal is always reachable and no special entrance/exit patching is needed.
- **Simple and small:** The algorithm is a short recursive function that is easy to reason about and extend (ADR-007 adds loops as a post-processing step).
- **Unbiased randomness:** Fisher-Yates avoids the biased ordering of the comparator-based shuffle.
- **Cell state stays clean:** Generation bookkeeping (`visited`) lives outside the `Cell` type.

### Negative (Cons / Trade-offs)
- **Recursion depth (inferred):** Call depth can reach the number of cells (625 at 25x25). That is fine now, but a much larger maze would need an iterative version.
- **Corridor-heavy mazes:** Depth-first carving tends to produce long winding corridors with relatively few branches, which affects how the mazes feel.
- **Not reproducible:** `Math.random()` is unseeded, so a particular maze cannot be replayed or shared.
- **Fixed start and goal:** Corners are hard-coded (`{0,0}` and `{size-1,size-1}`), so difficulty varies only by size and loops.
