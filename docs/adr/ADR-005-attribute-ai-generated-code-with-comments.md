# ADR-005: Mark AI-generated and AI-edited code with `CHQ:` attribution comments

## Status
- **Status:** Accepted
- **Date:** 2026-09-20 21:28 EDT
- **Authors:** Conrad Hansen-Quartey
- **Deciders:** Conrad Hansen-Quartey

## Context
Much of the code was written or revised with Claude models. Provenance is recorded in the source rather than only in commit history.
- `MazeGame.tsx` and `MazeGame.css` (`70f6c18`) open with `// CHQ: Claude AI (Haiku) generated file`.
- Later work is attributed to Sonnet, for example `Claude AI (Sonnet): Fisher-Yates shuffle ...`, `Claude AI (Sonnet) generated file` (`createLevel.ts`), and `Claude AI (Sonnet) edited - wedding theme` (`6c5af2f`).
- `git-diffs/` was added to `.gitignore` (`e9fc01f`) to keep these files
  outside of production code (since they are only intended for testing 
  purposes)
- Pasted model output needed cleanup at least once: the first `MazeGame.css` contained a stray `css` line (a code-fence language tag), removed in `6c5af2f`.

## Decision
We will annotate AI-generated or AI-edited files and functions with a `CHQ: Claude AI (<model>)` comment stating what was generated or changed, and we will keep locally exported diffs out of version control via `git-diffs/` in `.gitignore`.

## Consequences
Every technical choice has a trade-off.

### Positive (Pros)
- **Provenance is visible in the code:** A reader can tell which model produced or changed a piece of code without digging through history.
- **Review focus:** Marked code is an obvious candidate for extra scrutiny, which is useful given the defects that were later fixed (invalid `keyof typeof` casts, biased shuffle, diagonal wall clipping in `2f6ade9`).
- **Clean repo:** Exported diffs do not pollute the tree.

### Negative (Cons / Trade-offs)
- **Comments can go stale:** Headers such as "generated file" stay after heavy human or later-model edits, and inline notes can end up describing code that has since moved (e.g., the Fisher-Yates and type notes were carried into `shuffle.ts` and `dataTypes.ts` by ADR-006).
- **Not applied uniformly:** Some files added alongside marked ones (for example `pointsFor.ts`) carry no marker, so absence of a comment is not proof of human authorship.
- **Noise:** Attribution comments add clutter that git history (`git blame`, commit messages, or a `Co-authored-by` trailer) could carry instead.
- **Unreviewed paste artifacts:** The stray `css` line shows AI output was committed without a full read-through at least once.
