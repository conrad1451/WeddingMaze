# ADR-006: Split game logic into small modules with central types and tuning constants

## Status
- **Status:** Accepted (file layout superseded by ADR-012)
- **Date:** 2026-09-21 07:51 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
`MazeGame.tsx` began as a single file (265 lines in `70f6c18`, larger after the `2f6ade9` fixes) holding types, constants, maze generation, the shuffle helper, the character drawing, input handling, and the UI.
- `5d4b289` ("split MazeGame into multiple components") pulled most of that out into separate modules; `MazeGame.tsx` shrank by roughly 90 lines net.
- `b0c8281` continued the pattern when adding levels and scoring, and added a section of "tuning knobs" to the constants file.

## Decision
We will keep pure logic and configuration out of the React component, using one concern per module:
- `src/generateMaze.ts`, `src/shuffle.ts`, `src/createLevel.ts`, `src/pointsFor.ts`, `src/shortestPathLength.ts`: pure functions.
- `src/StickFigure.tsx`: the player's SVG rendering.
- `src/utils/dataTypes.ts`: shared types (`Wall`, `Direction`, `Phase`, `Cell`, `Position`, `LevelData`, `LevelResult`).
- `src/utils/gameConstants.ts`: directions, key bindings, and all difficulty/scoring "tuning knobs".

`MazeGame.tsx` keeps state, effects, input wiring, and layout.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Testable logic:** `generateMaze`, `createLevel`, `pointsFor`, and `shortestPathLength` do not depend on React, so they can be unit tested without rendering (though no tests exist yet, see ADR-001).
- **One place to tune the game:** Level count, sizes, loop fade, par, and point values are all in `gameConstants.ts`.
- **Shared, explicit types:** Types like `Direction` and `Wall` replaced unsafe casts and are reused across modules.
- **Smaller diffs:** Changes such as the wedding theme (ADR-010) touched only the rendering files.

### Negative (Cons / Trade-offs)
- **Inconsistent placement:** Types and constants live in `src/utils/`, while logic modules sit directly in `src/`.
- **`MazeGame.tsx` is still large:** It owns phases, timers, input, effects, and all overlay screens (see ADR-009), so the split only partly reduced its responsibilities.
- **Shared constants coupling:** Several modules import from `gameConstants.ts`, so changing a constant's meaning can ripple across files.
- **Commit message vs reality:** The refactor commit calls these "components", but most are plain functions.
