// MazeGame.tsx

// CHQ: Claude AI (Haiku) generated file, Claude AI (Sonnet) edited - wedding theme, split into components, hooks and a reducer

import { useCallback, useReducer } from 'react';
import '../styles/MazeGame.css';

import type { Direction } from "../utils/dataTypes.ts"

import { createLevel } from '../game/createLevel.ts';
import { createInitialState, gameReducer } from '../game/gameReducer.ts';
import { useGameClock } from '../hooks/useGameClock.ts';
import { useHeldKeySteering } from '../hooks/useHeldKeySteering.ts';

import { GameCompleteScreen } from './GameCompleteScreen.tsx';
import { Hud } from './Hud.tsx';
import { LevelCompleteScreen } from './LevelCompleteScreen.tsx';
import { MazeBoard } from './MazeBoard.tsx';
import { StartScreen } from './StartScreen.tsx';

function MazeGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const { phase, level, levelData, playerPos, elapsed, results } = state;

  const playing = phase === 'playing';
  useGameClock(playing, dispatch);

  const move = useCallback(
    (direction: Direction) => dispatch({ type: 'move', direction, now: performance.now() }),
    [],
  );
  useHeldKeySteering(playing, move);

  const startGame = () =>
    dispatch({ type: 'startGame', levelData: createLevel(1), now: performance.now() });
  const nextLevel = () =>
    dispatch({ type: 'nextLevel', levelData: createLevel(level + 1), now: performance.now() });

  const totalScore = results.reduce((sum, r) => sum + r.points, 0);
  const totalSeconds = results.reduce((sum, r) => sum + r.seconds, 0);
  const lastResult = results[results.length - 1];

  return (
    <div className="maze-container">
      <h1>💍 Race to the Altar</h1>

      <div className="controls">
        <p>Use Arrow Keys or WASD to walk down the aisle</p>
        {phase !== 'start' &&
          <button onClick={() => dispatch({ type: 'restart' })}>
            Restart wedding
          </button>
        }
      </div>

      {(phase === 'playing' || phase === 'levelComplete') && (
        <Hud
          level={level}
          elapsed={elapsed}
          levelData={levelData}
          totalScore={totalScore} />
      )}

      {phase !== 'start' && (
        <MazeBoard levelData={levelData} playerPos={playerPos} />
      )}

      {phase === 'start' && <StartScreen onStart={startGame} />}

      {phase === 'levelComplete' && lastResult && (
        <LevelCompleteScreen
          result={lastResult}
          levelData={levelData}
          totalScore={totalScore}
          onNext={nextLevel} />
      )}

      {phase === 'gameComplete' && (
        <GameCompleteScreen
          results={results}
          totalScore={totalScore}
          totalSeconds={totalSeconds}
          onPlayAgain={startGame} />
      )}
    </div>
  );
}

export default MazeGame;
