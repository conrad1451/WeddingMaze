// MazeGame.tsx

// CHQ: Claude AI (Haiku) generated file

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './MazeGame.css';

import type { Direction, Cell, Position } from "./utils/dataTypes.ts"

import {
  MAZE_SIZE,
  DIRECTIONS,
  KEY_TO_DIRECTION,
  CELL_SIZE,
  GOAL,
  MOVE_DELAY_MS,
  PADDING,
  WALL_WIDTH
} from "./utils/gameConstants"


import { generateMaze } from './generateMaze.ts';

import { StickFigure } from './StickFigure.tsx';




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