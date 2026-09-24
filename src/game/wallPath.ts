// CHQ: Claude AI (Sonnet) generated file
import type { Cell } from '../utils/dataTypes.ts';

// Builds a single SVG path (a series of "M x y H x2" / "M x y V y2" segments) that draws every
// wall in the maze. generateMaze always removes a wall from both neighbouring cells, so a shared
// wall only needs drawing once: every cell contributes its top and left walls, and the last
// column and row also contribute their right and bottom (outer) walls.
export function wallPath(maze: Cell[][], cellSize: number): string {
  const last = maze.length - 1;
  const segments: string[] = [];

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const left = x * cellSize;
      const top = y * cellSize;
      const right = left + cellSize;
      const bottom = top + cellSize;

      if (cell.walls.top) segments.push(`M${left} ${top}H${right}`);
      if (cell.walls.left) segments.push(`M${left} ${top}V${bottom}`);
      if (x === last && cell.walls.right) segments.push(`M${right} ${top}V${bottom}`);
      if (y === last && cell.walls.bottom) segments.push(`M${left} ${bottom}H${right}`);
    });
  });

  return segments.join('');
}
