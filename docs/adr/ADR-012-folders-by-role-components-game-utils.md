# ADR-012: Organize `src/` into role-based folders: `components/`, `game/`, and `utils/`

## Status
- **Status:** Accepted
- **Date:** 2026-09-23 22:51 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
ADR-006 split `MazeGame.tsx` into small modules but left them in an inconsistent layout: shared types and constants lived in `src/utils/`, while the React component, the character drawing, and the pure logic modules all sat directly in `src/`. ADR-006 listed this as a trade-off.
- Options considered:
  - Non-React code in `src/utils/` with React code left in `src/`.
  - Folders by role (`components/`, `game/`, `types/`, `config/`).
  - Everything game-related in a single `src/game/` folder.
- Implemented in `f0be0e8`. The change moves eight files and edits `src/App.tsx` (its import of `MazeGame`), using renames so git history follows the files.

## Decision
We will organize `src/` by role, with one rule per folder:
- **`src/components/`:** React components and their styles (`MazeGame.tsx`, `StickFigure.tsx`, `MazeGame.css`).
- **`src/game/`:** pure game logic with no React dependency (`createLevel.ts`, `generateMaze.ts`, `pointsFor.ts`, `shortestPathLength.ts`, `shuffle.ts`).
- **`src/utils/`:** unchanged; shared types and constants (`dataTypes.ts`, `gameConstants.ts`).
- **`src/` root:** app entry and shell only (`main.tsx`, `App.tsx`, and the template's styles and assets).

This supersedes the file layout described in ADR-006. The rest of ADR-006 (small modules, central types and tuning constants) still applies.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **One placement rule:** Every source file has an obvious home based on what it is, which resolves the inconsistency noted in ADR-006.
- **Logic is isolated:** `game/` contains only pure functions, so it is the natural target for unit tests (none exist yet, see ADR-001).
- **Dependency direction is clear:** Components import from `game/` and `utils/`; game logic imports only from `utils/` and its own folder.
- **History preserved:** The move was staged as renames, so `git log --follow` and blame still work.

### Negative (Cons / Trade-offs)
- **`utils/` is a vague name:** It holds types and constants rather than utilities. Separate `types/` and `config/` folders would be more descriptive but were not chosen, to keep the change small.
- **Longer relative imports:** Cross-folder imports now look like `../game/createLevel` and `../utils/gameConstants`, and no path aliases are configured.
- **Older ADR text refers to old paths:** ADR-006 still lists the original `src/*.ts` locations, which is accurate for when it was written but no longer for the current tree.
