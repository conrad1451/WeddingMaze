// CHQ: Claude AI (Sonnet) generated file
import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { GameAction } from '../game/gameReducer.ts';

const CLOCK_TICK_MS = 100; // how often the HUD timer refreshes

// While `running`, tells the game reducer the time every CLOCK_TICK_MS so the HUD can show it.
export function useGameClock(running: boolean, dispatch: Dispatch<GameAction>): void {
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      dispatch({ type: 'tick', now: performance.now() });
    }, CLOCK_TICK_MS);

    return () => clearInterval(interval);
  }, [running, dispatch]);
}
