// src/createLevel.ts

import { 
    BASE_SIZE, 
    STARTING_LOOP_FRACTION, 
    LOOP_FRACTION_DROP_PER_LEVEL,
    MAX_CELL_SIZE,
    MAX_BOARD_PX,
    PAR_BASE_SECONDS,
    PAR_SECONDS_PER_STEP,
    BASE_POINTS,
    POINTS_PER_LEVEL
} from "../utils/gameConstants";

import type { LevelData } from "../utils/dataTypes";

import { generateMaze } from "./generateMaze";

import { shortestPathLength } from "./shortestPathLength";

// CHQ: Claude AI (Sonnet) generated file
export function createLevel(level: number): LevelData {
  const size = BASE_SIZE + level;
  const loopFraction = Math.max(
    0, 
    STARTING_LOOP_FRACTION - (level - 1) * LOOP_FRACTION_DROP_PER_LEVEL);
  const maze = generateMaze(size, loopFraction);
  const shortestPath = shortestPathLength(maze);
 
  return {
    size,
    cellSize: Math.min(MAX_CELL_SIZE, Math.floor(MAX_BOARD_PX / size)),
    maze,
    shortestPath,
    parSeconds: PAR_BASE_SECONDS + shortestPath * PAR_SECONDS_PER_STEP,
    maxPoints: BASE_POINTS + level * POINTS_PER_LEVEL,
  };
}