// CHQ: Claude AI (Sonnet) generated file
import type { Position } from '../utils/dataTypes.ts';

// Every maze starts in the top-left corner and ends in the bottom-right one.
export const START_POSITION: Position = { x: 0, y: 0 };

export const goalPosition = (size: number): Position => ({ x: size - 1, y: size - 1 });

export const isAtGoal = (pos: Position, size: number): boolean =>
  pos.x === size - 1 && pos.y === size - 1;
