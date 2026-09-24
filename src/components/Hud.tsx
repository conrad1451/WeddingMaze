// CHQ: Claude AI (Sonnet) generated file
import type { LevelData } from '../utils/dataTypes.ts';
import { TOTAL_LEVELS } from '../utils/gameConstants.ts';
import { formatSeconds } from '../utils/formatSeconds.ts';
import { pointsFor } from '../game/pointsFor.ts';

interface HudProps {
  level: number;
  elapsed: number; // seconds
  levelData: LevelData;
  totalScore: number;
}

export function Hud({ level, elapsed, levelData, totalScore }: HudProps) {
  const liveWorth = pointsFor(levelData, elapsed);
  const underPar = elapsed <= levelData.parSeconds;

  return (
    <div className="hud">
      <span>
        Aisle {level} / {TOTAL_LEVELS}
      </span>
      <span>Time {formatSeconds(elapsed)}</span>
      <span>Par {formatSeconds(levelData.parSeconds)}</span>
      <span className={underPar ? 'hud-worth hud-worth--under-par' : 'hud-worth'}>
        Worth {liveWorth} 💐
      </span>
      <span>Total {totalScore} 💐</span>
    </div>
  );
}
