// Recursive backtracking over the full grid. Every cell is reachable,
// so the goal in the far corner is always reachable from the start.

import type { Cell } from "./utils/dataTypes";

import { DIRECTIONS } from "./utils/gameConstants"

import { shuffle } from "./shuffle";

export function generateMaze(
  size: number, 
  loopFraction: number
): Cell[][] {
  const grid: Cell[][] = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
  const visited: boolean[][] = Array.from({ 
    length: size 
  }, () => Array<boolean>(size).fill(false));
 
  const carve = (x: number, y: number) => {
    visited[y][x] = true;
 
    for (const dir of shuffle(Object.values(DIRECTIONS))) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
 
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && !visited[ny][nx]) {
        grid[y][x].walls[dir.wall] = false;
        grid[ny][nx].walls[dir.opposite] = false;
        carve(nx, ny);
      }
    }
  };
 
  carve(0, 0);
 
  // Remove some interior walls that are still standing
  const candidates: { x: number; y: number; dir: 'right' | 'down' }[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x < size - 1 && grid[y][x].walls.right) { 
        candidates.push({ x, y, dir: 'right' });
      }
      if (y < size - 1 && grid[y][x].walls.bottom) {
        candidates.push({ x, y, dir: 'down' });
      }
    }
  }
  const toRemove = Math.round(size * size * loopFraction);
  for (const { x, y, dir } of shuffle(candidates).slice(0, toRemove)) {
    const d = DIRECTIONS[dir];
    grid[y][x].walls[d.wall] = false;
    grid[y + d.dy][x + d.dx].walls[d.opposite] = false;
  }
 
  return grid;
}
