// CHQ: Claude AI (Sonnet) generated file
import { memo, useMemo } from 'react';
import type { LevelData, Position } from '../utils/dataTypes.ts';
import { PADDING, WALL_WIDTH } from '../utils/gameConstants.ts';
import { goalPosition } from '../game/positions.ts';
import { wallPath } from '../game/wallPath.ts';
import { RingsGoal } from './RingsGoal.tsx';
import { StickFigure } from './StickFigure.tsx';

interface MazeBoardProps {
  levelData: LevelData;
  playerPos: Position;
}

// memo: the HUD clock re-renders the game every 100 ms; the board only needs to update when the
// level or the player's position changes.
export const MazeBoard = memo(function MazeBoard({ levelData, playerPos }: MazeBoardProps) {
  const { size, cellSize, maze } = levelData;
  const svgSize = size * cellSize + PADDING * 2;
  const goal = goalPosition(size);
  const walls = useMemo(() => wallPath(maze, cellSize), [maze, cellSize]);

  return (
    <svg
      width={svgSize}
      height={svgSize}
      className="maze-svg"
      role="img"
      aria-label="Maze. Reach the wedding rings in the bottom-right corner to reach the altar."
    >
      <g transform={`translate(${PADDING}, ${PADDING})`}>
        <RingsGoal x={goal.x} y={goal.y} cellSize={cellSize} />

        <path
          d={walls}
          fill="none"
          stroke="#7a5c48"
          strokeWidth={WALL_WIDTH}
          strokeLinecap="square"
        />

        <StickFigure x={playerPos.x} y={playerPos.y} cellSize={cellSize} />
      </g>
    </svg>
  );
});
