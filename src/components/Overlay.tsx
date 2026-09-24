// CHQ: Claude AI (Sonnet) generated file
import type { ReactNode } from 'react';

// Dimmed full-screen backdrop with a centred message card.
// (The class names date from the original "you win" screen.)
export function Overlay({ children }: { children: ReactNode }) {
  return (
    <div className="win-screen">
      <div className="win-message">{children}</div>
    </div>
  );
}
