// Recursive backtracking over the full grid. Every cell is reachable,
// so the goal in the far corner is always reachable from the start.

import type { Cell } from "./utils/dataTypes";

import { MAZE_SIZE, DIRECTIONS } from "./utils/gameConstants"

import { shuffle } from "./shuffle";

export function generateMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: MAZE_SIZE }, (_, y) =>
    Array.from({ length: MAZE_SIZE }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
  const visited: boolean[][] = Array.from({ length: MAZE_SIZE }, () =>
    Array<boolean>(MAZE_SIZE).fill(false)
  );

  const carve = (x: number, y: number) => {
    visited[y][x] = true;

    for (const dir of shuffle(Object.values(DIRECTIONS))) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && !visited[ny][nx]) {
        grid[y][x].walls[dir.wall] = false;
        grid[ny][nx].walls[dir.opposite] = false;
        carve(nx, ny);
      }
    }
  };

  carve(0, 0);
  return grid;
}