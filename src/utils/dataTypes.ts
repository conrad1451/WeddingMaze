// src/utils/dataTypes.ts

// CHQ: Claude AI (Sonnet): Wall and Direction types replace 
// the invalid keyof typeof lines.
export type Wall = 'top' | 'right' | 'bottom' | 'left';
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Cell {
  x: number;
  y: number;
  walls: Record<Wall, boolean>;
}

export interface Position {
  x: number;
  y: number;
}
