import type { Position, Direction, Wall } from "./dataTypes";



export const MAZE_SIZE = 11;
export const CELL_SIZE = 40;
export const WALL_WIDTH = 2;
export const PADDING = WALL_WIDTH; // keeps the outer walls from being clipped by the SVG edge
export const GOAL: Position = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 };
export const MOVE_DELAY_MS = 110; // minimum time between steps while a key is held

export const DIRECTIONS: Record<Direction, { dx: number; dy: number; wall: Wall; opposite: Wall }> = {
  up: { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
  right: { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
  down: { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
  left: { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
};

export const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
};