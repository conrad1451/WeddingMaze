// src/utils/dataTypes.ts

// CHQ: Claude AI (Sonnet): Wall and Direction types replace 
// the invalid keyof typeof lines.
export type Wall = 'top' | 'right' | 'bottom' | 'left';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Phase = 'start' | 'playing' | 'levelComplete' | 'gameComplete';

export interface Cell {
  x: number;
  y: number;
  walls: Record<Wall, boolean>;
}

export interface Position {
  x: number;
  y: number;
}
 
export interface LevelData {
  size: number; // maze is size x size cells
  cellSize: number; // pixels per cell (shrinks as the maze grows)
  maze: Cell[][];
  shortestPath: number; // fewest steps from start to goal
  parSeconds: number; // finish at or under this for full points
  maxPoints: number;
}
 
export interface LevelResult {
  level: number;
  seconds: number;
  points: number;
}

export interface UserStats {
  userId: string;
  username: string;
  bestTime: number | null;
  totalGames: number;
  averageTime: number | null;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  bestTime: number;
  totalGames: number;
}
export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  sessionJwt: string;
}
