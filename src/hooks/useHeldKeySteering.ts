// CHQ: Claude AI (Sonnet) generated file
import { useEffect } from 'react';
import type { Direction } from '../utils/dataTypes.ts';
import { KEY_TO_DIRECTION, MOVE_DELAY_MS } from '../utils/gameConstants.ts';

const REPEAT_POLL_MS = 20; // how often a held key is re-checked against MOVE_DELAY_MS

// Keyboard steering: one axis per step, most recently pressed key wins, rate-limited to one step
// per MOVE_DELAY_MS. While `enabled` is false no listeners or timers are active.
export function useHeldKeySteering(enabled: boolean, onStep: (direction: Direction) => void): void {
  useEffect(() => {
    if (!enabled) return;

    const held: Direction[] = [];
    let lastMove = 0;

    const step = () => {
      const direction = held[held.length - 1];
      if (!direction) return;

      const now = performance.now();
      if (now - lastMove < MOVE_DELAY_MS) return;

      lastMove = now;
      onStep(direction);
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
    const interval = setInterval(step, REPEAT_POLL_MS); // repeats the step while a key is held

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      clearInterval(interval);
    };
  }, [enabled, onStep]);
}
