# ADR-010: Apply the wedding theme by editing the game's copy, visuals, and styles in place

## Status
- **Status:** Accepted
- **Date:** 2026-09-23 20:59 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
The project is named WeddingMaze (`README.md`, `package.json` name `wedding-maze`), but the game was built as a generic "Stick Figure Maze Game" with a purple gradient, black walls, a stick figure, and a green square goal.
- Theme commit: `6c5af2f` ("feat: add wedding theme"). Its message states there are no changes to maze generation, scoring, or input handling.
- The commit was made 2026-09-23 20:59 EDT (recorded in the git log as 2026-09-24 00:59 UTC).

## Decision
We will apply the theme directly to the existing game rather than adding a theming layer:
- **Copy:** Levels become "aisles" (HUD "Aisle n / 20", "20 aisles stand between you and 'I do'", "Aisle N cleared", "You made it to the altar!"), and the board's `aria-label` describes reaching the rings and the altar.
- **Character:** The stick figure is replaced by a bride silhouette (veil, gown, arms, head, bouquet) in `StickFigure.tsx`, keeping the same `cellSize` scaling.
- **Goal marker:** The green square becomes two interlocking gold rings (`ringR = cellSize * 0.16`).
- **Palette and type:** Blush/gold gradient background, warm brown walls, and a serif font (`Georgia`, `Times New Roman`) in `MazeGame.css`.
- **HUD score unit:** The HUD's "Worth" and "Total" values use a bouquet emoji instead of "pts".

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Low risk:** Gameplay, scoring, and input code were untouched, so behaviour tuned in ADR-004, 007, and 008 is unchanged.
- **Cohesive result:** Copy, art, and colors all support one theme.
- **Small change:** Only rendering and style files changed (`MazeGame.tsx`, `StickFigure.tsx`, `MazeGame.css`).
- **Accessibility kept:** The updated `aria-label` still describes the goal.

### Negative (Cons / Trade-offs)
- **Theme is hard-coded:** Strings, colors, and shapes are spread through JSX and CSS, so a different theme or a plain mode would require edits in several places.
- **Naming drift:** The component and file are still called `StickFigure` although they now draw a bride.
- **Mixed score wording:** The HUD uses the bouquet emoji, while the level-complete and game-complete overlays still say "pts".
- **Reused class names:** Overlay classes such as `.win-screen` and `.win-message` remain from the original game, which can confuse maintainers.
- **Character detail is tiny at late levels:** At 22 px cells (ADR-007) the veil, gown, and bouquet render very small.
