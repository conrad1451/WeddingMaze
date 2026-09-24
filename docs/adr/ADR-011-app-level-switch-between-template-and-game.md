# ADR-011: Keep the Vite template as `OldApp` behind a hard-coded switch in `App`

## Status
- **Status:** Accepted
- **Date:** 2026-09-20 21:28 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
When `MazeGame` was first added (`70f6c18`), the Vite starter UI (counter, logos, doc links) was still in `App.tsx`.
- Rather than deleting it, the starter component was renamed `OldApp` and a new `App` chooses between the two using `const myChoice = 2` (`1` shows the template, anything else shows the game).
- With a `const` initialised to `2`, TypeScript infers the literal type `2`, so the comparison `myChoice === 1` can fail type-checking. `9c5f36d` ("fix: add 'number' type to `myChoice`", 2026-09-23 18:53 EDT) widened it to `const myChoice: number = 2`. (The reason is inferred from the change; the commit message only names the fix.)
- This is scaffolding, and it is likely to be temporary.

## Decision
We will keep the starter UI in the repo as `OldApp` and select the rendered component with a hard-coded `myChoice` constant in `App.tsx`, explicitly typed as `number`.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Easy comparison during scaffolding:** Flipping one number swaps between the working template and the game.
- **Build stays green:** The explicit `number` annotation lets `tsc -b` (ADR-001) pass.

### Negative (Cons / Trade-offs)
- **Dead code in the app:** `OldApp`, its assets (`hero.png`, `react.svg`, `vite.svg`), and `App.css` remain in the source and are likely still bundled.
- **Global template styles still apply (inferred from the imports):** `index.css` is still imported by `main.tsx`, so its `#root`, `body`, and heading styles continue to affect the game's layout.
- **Magic constant:** `myChoice` has no meaningful name or configuration path, and lint or reviewers may flag the unreachable branch.
- **Should be revisited:** Removing `OldApp` and the switch (and pruning template CSS) would supersede this ADR.
