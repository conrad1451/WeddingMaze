// CHQ: Claude AI (Haiku) generated file

// MazeGame.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './MazeGame.css';

interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

interface Position {
  x: number;
  y: number;
}

const MAZE_SIZE = 11;
const CELL_SIZE = 40;
const WALL_WIDTH = 2;

const MazeGame: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [won, setWon] = useState(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Generate maze using recursive backtracking
  const generateMaze = useCallback((): Cell[][] => {
    const grid: Cell[][] = Array(MAZE_SIZE)
      .fill(null)
      .map((_, y) =>
        Array(MAZE_SIZE)
          .fill(null)
          .map((_, x) => ({
            x,
            y,
            walls: { top: true, right: true, bottom: true, left: true },
            visited: false,
          }))
      );

    const carve = (x: number, y: number) => {
      grid[y][x].visited = true;
      const directions = [
        { x: 0, y: -1, wall: 'top', opposite: 'bottom' },
        { x: 1, y: 0, wall: 'right', opposite: 'left' },
        { x: 0, y: 1, wall: 'bottom', opposite: 'top' },
        { x: -1, y: 0, wall: 'left', opposite: 'right' },
      ].sort(() => Math.random() - 0.5);

      for (const dir of directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;

        if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && !grid[ny][nx].visited) {
          grid[y][x].walls[dir.wall as keyof typeof grid[y][x].walls] = false;
          grid[ny][nx].walls[dir.opposite as keyof typeof grid[ny][nx].walls] = false;
          carve(nx, ny);
        }
      }
    };

    carve(1, 1);

    // Ensure entrance and exit
    grid[1][1].walls.left = false;
    grid[MAZE_SIZE - 2][MAZE_SIZE - 2].walls.right = false;

    return grid;
  }, []);

  useEffect(() => {
    setMaze(generateMaze());
    setPlayerPos({ x: 1, y: 1 });
    setWon(false);
  }, [generateMaze]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerPos((prev) => {
        if (won) return prev;

        let newX = prev.x;
        let newY = prev.y;

        if (keysPressed.current['arrowup'] || keysPressed.current['w']) newY = Math.max(1, prev.y - 1);
        if (keysPressed.current['arrowdown'] || keysPressed.current['s']) newY = Math.min(MAZE_SIZE - 2, prev.y + 1);
        if (keysPressed.current['arrowleft'] || keysPressed.current['a']) newX = Math.max(1, prev.x - 1);
        if (keysPressed.current['arrowright'] || keysPressed.current['d']) newX = Math.min(MAZE_SIZE - 2, prev.x + 1);

        // Check collision with walls
        if (maze.length > 0) {
          const currentCell = maze[prev.y]?.[prev.x];
          const nextCell = maze[newY]?.[newX];

          if (currentCell && nextCell) {
            // Check if we can move in that direction
            if (newY < prev.y && currentCell.walls.top) return prev;
            if (newY > prev.y && currentCell.walls.bottom) return prev;
            if (newX < prev.x && currentCell.walls.left) return prev;
            if (newX > prev.x && currentCell.walls.right) return prev;
          }
        }

        // Check win condition
        if (newX === MAZE_SIZE - 2 && newY === MAZE_SIZE - 2) {
          setWon(true);
        }

        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [maze, won]);

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos({ x: 1, y: 1 });
    setWon(false);
  };

  const drawStickFigure = (x: number, y: number): JSX.Element => {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const headRadius = 8;
    const bodyLength = 12;
    const armLength = 8;
    const legLength = 10;

    return (
      <g key="stick-figure">
        {/* Head */}
        <circle cx={centerX} cy={centerY - bodyLength / 2} r={headRadius} fill="#ff6b6b" stroke="#000" strokeWidth="1" />
        {/* Body */}
        <line x1={centerX} y1={centerY - bodyLength / 2 + headRadius} x2={centerX} y2={centerY + bodyLength / 2} stroke="#000" strokeWidth="2" />
        {/* Left Arm */}
        <line x1={centerX} y1={centerY - bodyLength / 4} x2={centerX - armLength} y2={centerY - bodyLength / 4 - 3} stroke="#000" strokeWidth="2" />
        {/* Right Arm */}
        <line x1={centerX} y1={centerY - bodyLength / 4} x2={centerX + armLength} y2={centerY - bodyLength / 4 - 3} stroke="#000" strokeWidth="2" />
        {/* Left Leg */}
        <line x1={centerX} y1={centerY + bodyLength / 2} x2={centerX - 5} y2={centerY + bodyLength / 2 + legLength} stroke="#000" strokeWidth="2" />
        {/* Right Leg */}
        <line x1={centerX} y1={centerY + bodyLength / 2} x2={centerX + 5} y2={centerY + bodyLength / 2 + legLength} stroke="#000" strokeWidth="2" />
      </g>
    );
  };

  return (
    <div className="maze-container">
      <h1>Stick Figure Maze Game</h1>
      <div className="controls">
        <p>Use Arrow Keys or WASD to move</p>
        <button onClick={resetGame}>New Game</button>
      </div>

      {maze.length > 0 && (
        <svg
          width={MAZE_SIZE * CELL_SIZE}
          height={MAZE_SIZE * CELL_SIZE}
          className="maze-svg"
          style={{ border: '2px solid black', background: 'white' }}
        >
          {/* Draw maze walls */}
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <g key={`cell-${x}-${y}`}>
                {cell.walls.top && (
                  <line
                    x1={x * CELL_SIZE}
                    y1={y * CELL_SIZE}
                    x2={(x + 1) * CELL_SIZE}
                    y2={y * CELL_SIZE}
                    stroke="black"
                    strokeWidth={WALL_WIDTH}
                  />
                )}
                {cell.walls.right && (
                  <line
                    x1={(x + 1) * CELL_SIZE}
                    y1={y * CELL_SIZE}
                    x2={(x + 1) * CELL_SIZE}
                    y2={(y + 1) * CELL_SIZE}
                    stroke="black"
                    strokeWidth={WALL_WIDTH}
                  />
                )}
                {cell.walls.bottom && (
                  <line
                    x1={x * CELL_SIZE}
                    y1={(y + 1) * CELL_SIZE}
                    x2={(x + 1) * CELL_SIZE}
                    y2={(y + 1) * CELL_SIZE}
                    stroke="black"
                    strokeWidth={WALL_WIDTH}
                  />
                )}
                {cell.walls.left && (
                  <line
                    x1={x * CELL_SIZE}
                    y1={y * CELL_SIZE}
                    x2={x * CELL_SIZE}
                    y2={(y + 1) * CELL_SIZE}
                    stroke="black"
                    strokeWidth={WALL_WIDTH}
                  />
                )}
              </g>
            ))
          )}

          {/* Draw goal marker */}
          <rect
            x={(MAZE_SIZE - 2) * CELL_SIZE + 5}
            y={(MAZE_SIZE - 2) * CELL_SIZE + 5}
            width={CELL_SIZE - 10}
            height={CELL_SIZE - 10}
            fill="#90ee90"
            stroke="#228b22"
            strokeWidth="2"
          />

          {/* Draw stick figure */}
          {drawStickFigure(playerPos.x, playerPos.y)}
        </svg>
      )}

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