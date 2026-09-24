// CHQ: Claude AI (Sonnet) generated file
import type { LevelData, LevelResult } from '../utils/dataTypes.ts';
import { formatSeconds } from '../utils/formatSeconds.ts';
import { Overlay } from './Overlay.tsx';

interface LevelCompleteScreenProps {
  result: LevelResult;
  levelData: LevelData;
  totalScore: number;
  onNext: () => void;
}

export function LevelCompleteScreen({ result, levelData, totalScore, onNext }: LevelCompleteScreenProps) {
  return (
    <Overlay>
      <h2>Aisle {result.level} cleared 💐</h2>
      <p>
        Time {formatSeconds(result.seconds)} (par {formatSeconds(levelData.parSeconds)})
      </p>
      <p>
        +{result.points} of {levelData.maxPoints} pts
        {result.seconds <= levelData.parSeconds ? ' - right on time!' : ''}
      </p>
      <p>Total: {totalScore} pts</p>
      <button autoFocus onClick={onNext}>
        Next aisle ({result.level + 1})
      </button>
    </Overlay>
  );
}
