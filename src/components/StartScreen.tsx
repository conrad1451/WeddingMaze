// CHQ: Claude AI (Sonnet) generated file
import { TOTAL_LEVELS } from '../utils/gameConstants.ts';
import { Overlay } from './Overlay.tsx';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <Overlay>
      <h2>{TOTAL_LEVELS} aisles stand between you and "I do"</h2>
      <p>
        Each aisle is longer and trickier than the last. Reach the wedding rings as fast as you can: arriving at
        or under par earns full points, and every second you keep the guests waiting costs you.
      </p>
      <p>The timer starts the moment each aisle appears.</p>
      <button autoFocus onClick={onStart}>
        Walk down the aisle
      </button>
    </Overlay>
  );
}
