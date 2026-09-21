// src/shortestPathLength.ts

import type { Cell, Position } from "./utils/dataTypes";
import { DIRECTIONS } from "./utils/gameConstants";

// CHQ: Claude AI (Sonnet) generated function
// Breadth-first search: fewest steps from (0, 0) to the far corner.
export function shortestPathLength(maze: Cell[][]): number {
  const size = maze.length;
  const dist = Array.from({ length: size }, () => Array<number>(size).fill(-1));
  const queue: Position[] = [{ x: 0, y: 0 }];
  dist[0][0] = 0;
 
  for (let head = 0; head < queue.length; head++) {
    const { x, y } = queue[head];
    if (x === size - 1 && y === size - 1) return dist[y][x];
 
    for (const d of Object.values(DIRECTIONS)) {
      if (maze[y][x].walls[d.wall]) continue;
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (dist[ny]?.[nx] === -1) {
        dist[ny][nx] = dist[y][x] + 1;
        queue.push({ x: nx, y: ny });
      }
    }
  }
 
  return dist[size - 1][size - 1];
}