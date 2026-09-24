# Architecture Decision Records

Decisions recorded for the WeddingMaze repo, reconstructed from the full git history (9 commits, 2026-08-30 to 2026-09-23, all times EDT) using `ADR-000-template.md`.

| ADR | Decision | Status | Date (EDT) | Source commits |
| --- | --- | --- | --- | --- |
| [001](ADR-001-vite-react-typescript-toolchain.md) | Vite, React 19, TypeScript, and pnpm toolchain | Accepted | 2026-09-13 04:53 | `97b1974` |
| [002](ADR-002-render-maze-as-react-svg.md) | Render the maze as React-managed SVG | Accepted | 2026-09-20 21:28 | `70f6c18`, `2f6ade9`, `b0c8281` |
| [003](ADR-003-recursive-backtracking-maze-generation.md) | Recursive backtracking over the full grid, Fisher-Yates shuffle | Accepted | 2026-09-21 04:30 | `70f6c18`, `2f6ade9`, `b0c8281` |
| [004](ADR-004-grid-step-keyboard-input-model.md) | Discrete, rate-limited grid steps with a held-key stack | Accepted | 2026-09-21 04:30 | `70f6c18`, `2f6ade9` |
| [005](ADR-005-attribute-ai-generated-code-with-comments.md) | `CHQ:` attribution comments for AI-generated code | Accepted | 2026-09-20 21:28 | `70f6c18` onward, `e9fc01f` |
| [006](ADR-006-modular-files-with-central-types-and-constants.md) | Small modules with central types and tuning constants | Accepted | 2026-09-21 07:51 | `5d4b289`, `b0c8281` |
| [007](ADR-007-twenty-level-difficulty-progression.md) | 20 levels: growing size, fading shortcuts, scaled cells | Accepted | 2026-09-21 10:33 | `b0c8281` |
| [008](ADR-008-time-based-scoring-against-bfs-par.md) | Time-based scoring against a BFS-derived par | Accepted | 2026-09-21 10:33 | `b0c8281` |
| [009](ADR-009-explicit-game-phase-state-machine.md) | Explicit game-phase state machine | Accepted | 2026-09-21 10:33 | `b0c8281` |
| [010](ADR-010-wedding-theme-in-place-reskin.md) | Wedding theme applied by editing in place | Accepted | 2026-09-23 20:59 | `6c5af2f` |
| [011](ADR-011-app-level-switch-between-template-and-game.md) | Vite template kept as `OldApp` behind a hard-coded switch | Accepted | 2026-09-20 21:28 | `70f6c18`, `9c5f36d` |

## Notes on how these were written
- **Sources:** Context and Decision sections come from commit messages and diffs. Where the log does not state a reason, the reasoning is marked "inferred". Please review those points, since only you know the real motivation.
- **Authors and deciders:** Filled in from the git author (Conrad Hansen-Quartey) because the log does not record who decided what.
- **Dates:** All times are EDT (UTC-4), converted from the commit timestamps in the git log (which mixed UTC and -0400). Each ADR is dated to the commit where the decision was adopted in its current form: for ADR-002, 005 and 011 that is the first `MazeGame` commit, and for ADR-003 and 004 it is the `2f6ade9` rewrite.
- **Decisions revised within the history:** Early approaches for maze generation (ADR-003) and input handling (ADR-004) were replaced in `2f6ade9`. Each ADR records the current decision and mentions the earlier approach in Context, rather than creating separate superseded records.
- **Commits without their own ADR:** `bfd5474` (Initial commit, README only) and `e9fc01f` (`git-diffs/` in `.gitignore`, folded into ADR-005).

## Commit timeline (EDT)
| Commit | Date and time | Subject |
| --- | --- | --- |
| `bfd5474` | 2026-08-30 09:30:32 | Initial commit |
| `97b1974` | 2026-09-13 04:53:05 | feat: initialize vite project |
| `70f6c18` | 2026-09-20 21:28:31 | feat: implement MazeGame |
| `2f6ade9` | 2026-09-21 04:30:57 | Fix maze generation, movement, and stick figure rendering |
| `5d4b289` | 2026-09-21 07:51:30 | refactor: split MazeGame into multiple components |
| `b0c8281` | 2026-09-21 10:33:47 | feat: Add 20 levels with time-based scoring |
| `e9fc01f` | 2026-09-23 10:06:38 | docs: add git-diffs/ to .gitignore |
| `9c5f36d` | 2026-09-23 18:53:26 | fix: add 'number' type to `myChoice` |
| `6c5af2f` | 2026-09-23 20:59:12 | feat: add wedding theme |
