// MazeGame.tsx

// CHQ: Claude AI (Haiku) generated file, Claude AI (Sonnet) edited - wedding theme

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './MazeGame.css';

import type {
  Direction,
  LevelResult,
  Position,
  LevelData,
  Phase
} from "./utils/dataTypes.ts"

import {
  DIRECTIONS,
  KEY_TO_DIRECTION,
  MOVE_DELAY_MS,
  PADDING,
  WALL_WIDTH,
  TOTAL_LEVELS,
} from "./utils/gameConstants"

import { createLevel } from './createLevel.ts';

import { StickFigure } from './StickFigure.tsx';

import { pointsFor } from './pointsFor.ts';

const formatSeconds = (seconds: number) => `${seconds.toFixed(1)}s`;

const MazeGame: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('start');
  const [level, setLevel] = useState(1);
  const [levelData, setLevelData] = useState<LevelData>(() => createLevel(1));
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<LevelResult[]>([]);

  const startTimeRef = useRef(0);

  // Lets the keyboard handlers read the latest level without re-subscribing.
  const levelRef = useRef<LevelData>(levelData);
  useEffect(() => {
    levelRef.current = levelData;
  }, [levelData]);

  const totalScore = results.reduce((sum, r) => sum + r.points, 0);
  const totalSeconds = results.reduce((sum, r) => sum + r.seconds, 0);
  const lastResult = results[results.length - 1];
  const goal: Position = { x: levelData.size - 1, y: levelData.size - 1 };

  const startLevel = useCallback((n: number) => {
    setLevel(n);
    setLevelData(createLevel(n));
    setPlayerPos({ x: 0, y: 0 });
    setElapsed(0);
    startTimeRef.current = performance.now(); // timer starts the moment the maze appears
    setPhase('playing');
  }, []);

  const startGame = () => {
    setResults([]);
    startLevel(1);
  };

  // Move one cell in a single direction, respecting walls. Pure updater: no side effects.
  const move = useCallback((direction: Direction) => {
    const { dx, dy, wall } = DIRECTIONS[direction];

    setPlayerPos((prev) => {
      const { maze, size } = levelRef.current;
      const cell = maze[prev.y]?.[prev.x];
      if (!cell || cell.walls[wall]) return prev;

      const next = { x: prev.x + dx, y: prev.y + dy };
      if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) return prev;
      return next;
    });
  }, []);

  // Live timer for the HUD
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(() => {
      setElapsed((performance.now() - startTimeRef.current) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [phase, level]);

  // Level completion: score it and move to the next phase.
  useEffect(() => {
    if (phase !== 'playing') return;
    if (playerPos.x !== levelData.size - 1 || playerPos.y !== levelData.size - 1) return;

    const seconds = (performance.now() - startTimeRef.current) / 1000;
    setElapsed(seconds);
    setResults((prev) => [...prev, {
      level, seconds, points: pointsFor(levelData, seconds)
    }]);
    setPhase(level >= TOTAL_LEVELS ? 'gameComplete' : 'levelComplete');
  }, [playerPos, phase, level, levelData]);

  // Keyboard input: one axis per step, most recently pressed key wins, rate-limited.
  useEffect(() => {
    if (phase !== 'playing') return;

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
  }, [phase, move]);

  const { size, cellSize, maze } = levelData;
  const svgSize = size * cellSize + PADDING * 2;
  const liveWorth = pointsFor(levelData, elapsed);
  const underPar = elapsed <= levelData.parSeconds;
  // CHQ: Claude AI: radius for the interlocking-rings goal marker
  const ringR = cellSize * 0.16;

  return (
    <div className="maze-container">
      <h1>💍 Race to the Altar</h1>

      <div className="controls">
        <p>Use Arrow Keys or WASD to walk down the aisle</p>
        {phase !== 'start' &&
          <button onClick={() => setPhase('start')}>
            Restart wedding
          </button>
        }
      </div>

      {(phase === 'playing' || phase === 'levelComplete') && (
        <div
          className="hud"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 24px',
            justifyContent: 'center',
            margin: '8px 0'
          }}
        >
          <span>
            Aisle {level} / {TOTAL_LEVELS}
          </span>
          <span>Time {formatSeconds(elapsed)}</span>
          <span>Par {formatSeconds(levelData.parSeconds)}</span>
          <span style={{
            fontWeight: underPar ? 600 : 400
          }}>
            Worth {liveWorth} 💐
          </span>
          <span>Total {totalScore} 💐</span>
        </div>
      )}

      {phase !== 'start' && (
        <svg
          width={svgSize}
          height={svgSize}
          className="maze-svg"
          role="img"
          aria-label="Maze. Reach the wedding rings in the bottom-right corner to reach the altar."
          style={{ background: 'white' }}
        >
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            {/* Goal marker: interlocking wedding rings */}
            <g>
              <circle
                cx={goal.x * cellSize + cellSize / 2 - ringR * 0.55}
                cy={goal.y * cellSize + cellSize / 2}
                r={ringR}
                fill="none"
                stroke="#d4af37"
                strokeWidth={cellSize * 0.07}
              />
              <circle
                cx={goal.x * cellSize + cellSize / 2 + ringR * 0.55}
                cy={goal.y * cellSize + cellSize / 2}
                r={ringR}
                fill="none"
                stroke="#e8c15c"
                strokeWidth={cellSize * 0.07}
              />
            </g>

            {/* Maze walls */}
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <g
                  key={`cell-${x}-${y}`}
                  stroke="#7a5c48"
                  strokeWidth={WALL_WIDTH}
                  strokeLinecap="square"
                >
                  {cell.walls.top && (
                    <line
                      x1={x * cellSize}
                      y1={y * cellSize}
                      x2={(x + 1) * cellSize}
                      y2={y * cellSize} />
                  )}
                  {cell.walls.right && (
                    <line
                      x1={(x + 1) * cellSize}
                      y1={y * cellSize}
                      x2={(x + 1) * cellSize}
                      y2={(y + 1) * cellSize} />
                  )}
                  {cell.walls.bottom && (
                    <line
                      x1={x * cellSize}
                      y1={(y + 1) * cellSize}
                      x2={(x + 1) * cellSize}
                      y2={(y + 1) * cellSize} />
                  )}
                  {cell.walls.left && (
                    <line
                      x1={x * cellSize}
                      y1={y * cellSize}
                      x2={x * cellSize}
                      y2={(y + 1) * cellSize} />
                  )}
                </g>
              ))
            )}

            {/* Player */}
            <StickFigure
              x={playerPos.x}
              y={playerPos.y}
              cellSize={cellSize} />
          </g>
        </svg>
      )}

      {phase === 'start' && (
        <div className="win-screen">
          <div className="win-message">
            <h2>20 aisles stand between you and "I do"</h2>
            <p>
              Each aisle is longer and trickier than the last. Reach the wedding rings as fast as you can: arriving at
              or under par earns full points, and every second you keep the guests waiting costs you.
            </p>
            <p>The timer starts the moment each aisle appears.</p>
            <button autoFocus onClick={startGame}>
              Walk down the aisle
            </button>
          </div>
        </div>
      )}

      {phase === 'levelComplete' && lastResult && (
        <div className="win-screen">
          <div className="win-message">
            <h2>Aisle {lastResult.level} cleared 💐</h2>
            <p>
              Time {formatSeconds(lastResult.seconds)} (par {formatSeconds(levelData.parSeconds)})
            </p>
            <p>
              +{lastResult.points} of {levelData.maxPoints} pts
              {lastResult.seconds <= levelData.parSeconds ? ' - right on time!' : ''}
            </p>
            <p>Total: {totalScore} pts</p>
            <button autoFocus onClick={() => startLevel(level + 1)}>
              Next aisle ({level + 1})
            </button>
          </div>
        </div>
      )}

      {phase === 'gameComplete' && (
        <div className="win-screen">
          <div className="win-message">
            <h2>💍 You made it to the altar!</h2>
            <p>Final score: {totalScore} pts</p>
            <p>Total time: {formatSeconds(totalSeconds)}</p>
            <div style={{ maxHeight: 200, overflowY: 'auto', margin: '12px 0' }}>
              <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '2px 12px' }}>Aisle</th>
                    <th style={{ padding: '2px 12px' }}>Time</th>
                    <th style={{ padding: '2px 12px' }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.level}>
                      <td style={{ padding: '2px 12px' }}>{r.level}</td>
                      <td style={{ padding: '2px 12px' }}>{formatSeconds(r.seconds)}</td>
                      <td style={{ padding: '2px 12px' }}>{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button autoFocus onClick={startGame}>
              Renew your vows (play again)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MazeGame;