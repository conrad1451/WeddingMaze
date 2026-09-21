import type { Direction, Wall } from "./dataTypes";

// ---------------------------------------------------------------------------
// Tuning knobs
// ---------------------------------------------------------------------------
export const TOTAL_LEVELS = 20;
export const BASE_SIZE = 5; // level 1 is BASE_SIZE + 1 = 6x6, level 20 is 25x25
export const MAX_BOARD_PX = 560;
export const MAX_CELL_SIZE = 56;
export const BASE_FIGURE_CELL = 40; // cell size the stick figure was designed for

export const WALL_WIDTH = 2;
export const PADDING = WALL_WIDTH; // keeps the outer walls from being clipped by the SVG edge
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

// Early levels get extra openings (loops), which create shortcuts and make
// the maze easier. The loops fade out by level 13.
export const STARTING_LOOP_FRACTION = 0.12;
export const LOOP_FRACTION_DROP_PER_LEVEL = 0.01;
 
// Scoring: full points at or under par, then a linear drop to the minimum.
export const PAR_BASE_SECONDS = 3;
export const PAR_SECONDS_PER_STEP = 0.3;
export const DECAY_PAR_MULTIPLES = 4; // extra pars over par until the minimum is hit
export const MIN_TIME_FACTOR = 0.1; // finishing at all is always worth 10%
export const BASE_POINTS = 400;
export const POINTS_PER_LEVEL = 100; // later levels are worth more
 
