# ADR-002: Render the maze board as a React-managed SVG

## Status
- **Status:** Accepted
- **Date:** 2026-09-20 21:28 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
The game needs to draw a grid of walls, a player character, and a goal marker, and the board size changes from level to level (see ADR-007).
- The first implementation (`70f6c18`) drew each cell's four walls as `<line>` elements inside an `<svg>`.
- `2f6ade9` refined the approach: shared stroke attributes moved onto each cell's `<g>`, a `PADDING` equal to `WALL_WIDTH` was added so outer walls are not clipped at the SVG edge, and `role="img"` plus an `aria-label` were added.
- `b0c8281` made the board dimensions data-driven (`size * cellSize + PADDING * 2`).

## Decision
We will render the whole board, player, and goal as **declarative SVG elements in React**, rather than drawing to a `<canvas>` imperatively.
- Each cell renders up to four wall `<line>`s.
- The player is a `<g>` positioned with `transform="translate(...) scale(...)"`.
- The board has an accessible name via `role="img"` and `aria-label`.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Resolution independent:** SVG stays crisp at any cell size, which matters because cell size shrinks as mazes grow.
- **Easy to restyle:** Colors, strokes, and shapes are plain JSX/CSS. The wedding theme (ADR-010) swapped the character and goal marker without touching game logic.
- **Accessible label:** The board carries a text description for assistive tech.
- **Simple mental model:** Game state maps directly to what is drawn.

### Negative (Cons / Trade-offs)
- **DOM size grows with the maze:** At level 20 (25x25) the board is 625 cell groups with up to four lines each. Shared walls between neighbouring cells are drawn by both cells.
- **Whole-board re-renders (inferred, not measured):** The wall grid is rendered inside `MazeGame`, so player-position and timer state updates re-render it unless memoized. This is fine at current sizes but could matter if boards get larger.
- **Limited per-cell accessibility:** The board is announced as a single image, so screen-reader users get no information about the maze itself.
