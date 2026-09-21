// src/pointsFor.ts

import type { LevelData } from "./utils/dataTypes";
import { MIN_TIME_FACTOR, DECAY_PAR_MULTIPLES } from "./utils/gameConstants";

export function pointsFor(
    levelData: LevelData, 
    seconds: number
): number {
  const overPar = Math.max(0, seconds - levelData.parSeconds);
  const factor = Math.max(
    MIN_TIME_FACTOR, 1 - overPar / 
    (levelData.parSeconds * DECAY_PAR_MULTIPLES)
);
  return Math.round(levelData.maxPoints * factor);
}