// CHQ: Claude AI (Sonnet) generated file
import type { Direction, LevelData, LevelResult, Phase, Position } from '../utils/dataTypes.ts';
import { DIRECTIONS, TOTAL_LEVELS } from '../utils/gameConstants.ts';
import { createLevel } from './createLevel.ts';
import { isAtGoal, START_POSITION } from './positions.ts';
import { pointsFor } from './pointsFor.ts';

export interface GameState {
  phase: Phase;
  level: number;
  levelData: LevelData;
  playerPos: Position;
  startedAt: number; // performance.now() when the current level appeared
  elapsed: number; // seconds: live while playing, final once the level is complete
  results: LevelResult[];
}

// The reducer stays pure: anything random (the new maze) or time-dependent (`now`) is passed in.
export type GameAction =
  | { type: 'startGame'; levelData: LevelData; now: number }
  | { type: 'nextLevel'; levelData: LevelData; now: number }
  | { type: 'move'; direction: Direction; now: number }
  | { type: 'tick'; now: number }
  | { type: 'restart' };

export function createInitialState(): GameState {
  return {
    phase: 'start',
    level: 1,
    levelData: createLevel(1),
    playerPos: START_POSITION,
    startedAt: 0,
    elapsed: 0,
    results: [],
  };
}

const secondsSince = (startedAt: number, now: number) => (now - startedAt) / 1000;

// The timer starts the moment the maze appears.
function beginLevel(state: GameState, level: number, levelData: LevelData, now: number): GameState {
  return {
    ...state,
    phase: 'playing',
    level,
    levelData,
    playerPos: START_POSITION,
    startedAt: now,
    elapsed: 0,
  };
}

// Move one cell in a single direction, respecting walls. Reaching the goal scores the level.
function move(state: GameState, direction: Direction, now: number): GameState {
  if (state.phase !== 'playing') return state;

  const { dx, dy, wall } = DIRECTIONS[direction];
  const { level, levelData, playerPos } = state;
  const { maze, size } = levelData;

  const cell = maze[playerPos.y]?.[playerPos.x];
  if (!cell || cell.walls[wall]) return state;

  const next = { x: playerPos.x + dx, y: playerPos.y + dy };
  if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) return state;

  if (!isAtGoal(next, size)) return { ...state, playerPos: next };

  const seconds = secondsSince(state.startedAt, now);
  return {
    ...state,
    playerPos: next,
    phase: level >= TOTAL_LEVELS ? 'gameComplete' : 'levelComplete',
    elapsed: seconds,
    results: [...state.results, { level, seconds, points: pointsFor(levelData, seconds) }],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'startGame':
      return beginLevel({ ...state, results: [] }, 1, action.levelData, action.now);
    case 'nextLevel':
      return beginLevel(state, state.level + 1, action.levelData, action.now);
    case 'move':
      return move(state, action.direction, action.now);
    case 'tick':
      if (state.phase !== 'playing') return state;
      return { ...state, elapsed: secondsSince(state.startedAt, action.now) };
    case 'restart':
      return { ...state, phase: 'start' };
  }
}
