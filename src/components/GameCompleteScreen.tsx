// CHQ: Claude AI (Sonnet) generated file
import type { LevelResult } from '../utils/dataTypes.ts';
import { formatSeconds } from '../utils/formatSeconds.ts';
import { Overlay } from './Overlay.tsx';

function ResultsTable({ results }: { results: LevelResult[] }) {
  return (
    <div className="results-scroll">
      <table className="results-table">
        <thead>
          <tr>
            <th>Aisle</th>
            <th>Time</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.level}>
              <td>{r.level}</td>
              <td>{formatSeconds(r.seconds)}</td>
              <td>{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GameCompleteScreenProps {
  results: LevelResult[];
  totalScore: number;
  totalSeconds: number;
  onPlayAgain: () => void;
}

export function GameCompleteScreen({ results, totalScore, totalSeconds, onPlayAgain }: GameCompleteScreenProps) {
  return (
    <Overlay>
      <h2>💍 You made it to the altar!</h2>
      <p>Final score: {totalScore} pts</p>
      <p>Total time: {formatSeconds(totalSeconds)}</p>
      <ResultsTable results={results} />
      <button autoFocus onClick={onPlayAgain}>
        Renew your vows (play again)
      </button>
    </Overlay>
  );
}
