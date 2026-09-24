# ADR-001: Use Vite, React 19, TypeScript, and pnpm as the application toolchain

## Status
- **Status:** Accepted
- **Date:** 2026-09-13 04:53 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
The repo began as an empty "WeddingMaze" project (`bfd5474`, README only). It needed a front-end app shell for an interactive, browser-based maze game.
- The game is a client-only, highly interactive UI (keyboard input, timers, SVG rendering) with no backend requirement visible anywhere in the history.
- The project was scaffolded from the standard Vite React + TypeScript template (`97b1974`), including its ESLint and tsconfig setup.
- Relevant files: `package.json`, `vite.config.ts`, `eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `pnpm-lock.yaml`.

## Decision
We will build the app with **Vite** (dev server and bundler, `@vitejs/plugin-react`), **React 19** and **TypeScript**, managed with **pnpm**.

Supporting choices that came with the scaffold:
- `npm run build` runs `tsc -b && vite build`, so type errors fail the build.
- TypeScript uses project references (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`).
- Compiler flags include `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- ESLint flat config with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Fast feedback loop:** Vite's dev server gives quick startup and HMR, which suits iterating on game feel and visuals.
- **Type safety gates the build:** `tsc -b` in the build script catches type errors before a bundle is produced (the `myChoice` fix in ADR-011 is an example).
- **Hook correctness linting:** `eslint-plugin-react-hooks` is valuable here because the game relies heavily on `useEffect` dependency arrays and refs (see ADR-004 and ADR-009).
- **Static output:** A Vite build is plain static files, easy to host anywhere.

### Negative (Cons / Trade-offs)
- **No test runner:** No Vitest/Jest (or similar) is configured in `devDependencies`, so the pure logic added later (maze generation, BFS, scoring) has no automated tests.
- **Very new dependency versions:** The lockfile pins recent major versions (Vite 8, TypeScript 6, ESLint 10, React 19), which may mean fewer community answers and more churn on upgrades.
- **Template leftovers:** The scaffold's demo code and styles remain in the repo (see ADR-011).
