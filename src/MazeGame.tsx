// MazeGame.tsx

// CHQ: Claude AI (Haiku) generated file

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './MazeGame.css';

// CHQ: Claude AI (Sonnet): Wall and Direction types replace 
// the invalid keyof typeof lines.
type Wall = 'top' | 'right' | 'bottom' | 'left';
type Direction = 'up' | 'down' | 'left' | 'right';

interface Cell {
  x: number;
  y: number;
  walls: Record<Wall, boolean>;
}

interface Position {
  x: number;
  y: number;
}

const MAZE_SIZE = 11;
const CELL_SIZE = 40;
const WALL_WIDTH = 2;
const PADDING = WALL_WIDTH; // keeps the outer walls from being clipped by the SVG edge
const GOAL: Position = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 };
const MOVE_DELAY_MS = 110; // minimum time between steps while a key is held

const DIRECTIONS: Record<Direction, { dx: number; dy: number; wall: Wall; opposite: Wall }> = {
  up: { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
  right: { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
  down: { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
  left: { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
};

// CHQ: Claude AI (Sonnet): Fisher–Yates shuffle (unbiased, unlike sort(() => Math.random() - 0.5))
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Recursive backtracking over the full grid. Every cell is reachable,
// so the goal in the far corner is always reachable from the start.
function generateMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: MAZE_SIZE }, (_, y) =>
    Array.from({ length: MAZE_SIZE }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
  const visited: boolean[][] = Array.from({ length: MAZE_SIZE }, () =>
    Array<boolean>(MAZE_SIZE).fill(false)
  );

  const carve = (x: number, y: number) => {
    visited[y][x] = true;

    for (const dir of shuffle(Object.values(DIRECTIONS))) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && !visited[ny][nx]) {
        grid[y][x].walls[dir.wall] = false;
        grid[ny][nx].walls[dir.opposite] = false;
        carve(nx, ny);
      }
    }
  };

  carve(0, 0);
  return grid;
}

const StickFigure: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const cx = x * CELL_SIZE + CELL_SIZE / 2;
  const cy = y * CELL_SIZE + CELL_SIZE / 2;

  const headRadius = 6;
  const headY = cy - 10; // head spans cy-16 .. cy-4
  const neckY = headY + headRadius; // body starts where the head ends
  const hipY = cy + 7;
  const shoulderY = neckY + 3;

  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={headY} r={headRadius} fill="#ff6b6b" stroke="#000" strokeWidth="1" />
      {/* Body */}
      <line x1={cx} y1={neckY} x2={cx} y2={hipY} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Arms */}
      <line x1={cx} y1={shoulderY} x2={cx - 8} y2={shoulderY + 4} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={shoulderY} x2={cx + 8} y2={shoulderY + 4} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <line x1={cx} y1={hipY} x2={cx - 5} y2={hipY + 10} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={hipY} x2={cx + 5} y2={hipY + 10} stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

const MazeGame: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>(generateMaze);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [won, setWon] = useState(false);

  // Lets the keyboard handlers read the latest maze without re-subscribing.
  const mazeRef = useRef<Cell[][]>(maze);
  useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);

  // Move one cell in a single direction, respecting walls. Pure updater: no side effects.
  const move = useCallback((direction: Direction) => {
    const { dx, dy, wall } = DIRECTIONS[direction];

    setPlayerPos((prev) => {
      const cell = mazeRef.current[prev.y]?.[prev.x];
      if (!cell || cell.walls[wall]) return prev;

      const next = { x: prev.x + dx, y: prev.y + dy };
      if (next.x < 0 || next.x >= MAZE_SIZE || next.y < 0 || next.y >= MAZE_SIZE) return prev;
      return next;
    });
  }, []);

  // Win detection lives in an effect instead of inside the state updater.
  useEffect(() => {
    if (playerPos.x === GOAL.x && playerPos.y === GOAL.y) {
      setWon(true);
    }
  }, [playerPos]);

  // Keyboard input: one axis per step, most recently pressed key wins, rate-limited.
  useEffect(() => {
    if (won) return;

    const held: Direction[] = [];
    let lastMove = 0;

    const step = () => {
      const direction = held[held.length - 1];
      if (!direction) return;

      const now = performance.now();
      if (now - lastMove < MOVE_DELAY_MS) return;

      lastMove = now;
      move(direction);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[e.key.toLowerCase()];
      if (!direction) return;

      e.preventDefault(); // stop arrow keys from scrolling the page
      if (e.repeat) return;

      const index = held.indexOf(direction);
      if (index !== -1) held.splice(index, 1);
      held.push(direction);
      step(); // respond immediately to a fresh key press
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[e.key.toLowerCase()];
      if (!direction) return;

      const index = held.indexOf(direction);
      if (index !== -1) held.splice(index, 1);
    };

    // Avoid "stuck" keys if the window loses focus while a key is down.
    const handleBlur = () => {
      held.length = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    const interval = setInterval(step, 20); // repeats the step while a key is held

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      clearInterval(interval);
    };
  }, [won, move]);

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos({ x: 0, y: 0 });
    setWon(false);
  };

  const svgSize = MAZE_SIZE * CELL_SIZE + PADDING * 2;

  return (
    <div className="maze-container">
      <h1>Stick Figure Maze Game</h1>
      <div className="controls">
        <p>Use Arrow Keys or WASD to move</p>
        <button onClick={resetGame}>New Game</button>
      </div>

      <svg
        width={svgSize}
        height={svgSize}
        className="maze-svg"
        role="img"
        aria-label="Maze. Reach the green square in the bottom-right corner."
        style={{ background: 'white' }}
      >
        <g transform={`translate(${PADDING}, ${PADDING})`}>
          {/* Goal marker */}
          <rect
            x={GOAL.x * CELL_SIZE + 5}
            y={GOAL.y * CELL_SIZE + 5}
            width={CELL_SIZE - 10}
            height={CELL_SIZE - 10}
            fill="#90ee90"
            stroke="#228b22"
            strokeWidth="2"
          />

          {/* Maze walls */}
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <g key={`cell-${x}-${y}`} stroke="black" strokeWidth={WALL_WIDTH} strokeLinecap="square">
                {cell.walls.top && (
                  <line x1={x * CELL_SIZE} y1={y * CELL_SIZE} x2={(x + 1) * CELL_SIZE} y2={y * CELL_SIZE} />
                )}
                {cell.walls.right && (
                  <line x1={(x + 1) * CELL_SIZE} y1={y * CELL_SIZE} x2={(x + 1) * CELL_SIZE} y2={(y + 1) * CELL_SIZE} />
                )}
                {cell.walls.bottom && (
                  <line x1={x * CELL_SIZE} y1={(y + 1) * CELL_SIZE} x2={(x + 1) * CELL_SIZE} y2={(y + 1) * CELL_SIZE} />
                )}
                {cell.walls.left && (
                  <line x1={x * CELL_SIZE} y1={y * CELL_SIZE} x2={x * CELL_SIZE} y2={(y + 1) * CELL_SIZE} />
                )}
              </g>
            ))
          )}

          {/* Player */}
          <StickFigure x={playerPos.x} y={playerPos.y} />
        </g>
      </svg>

      {won && (
        <div className="win-screen">
          <div className="win-message">
            <h2>You escaped the maze!</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MazeGame;