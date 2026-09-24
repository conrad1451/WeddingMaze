// CHQ: Claude AI (Sonnet) generated file
// Goal marker: two interlocking wedding rings, centred in the given cell.
const RING_RADIUS = 0.16; // as a fraction of the cell size
const RING_STROKE = 0.07; // as a fraction of the cell size
const RING_OFFSET = 0.55; // each ring's centre sits this many radii from the cell centre

interface RingsGoalProps {
  x: number; // cell column
  y: number; // cell row
  cellSize: number;
}

export function RingsGoal({ x, y, cellSize }: RingsGoalProps) {
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  const r = cellSize * RING_RADIUS;
  const offset = r * RING_OFFSET;
  const strokeWidth = cellSize * RING_STROKE;

  return (
    <g>
      <circle cx={cx - offset} cy={cy} r={r} fill="none" stroke="#d4af37" strokeWidth={strokeWidth} />
      <circle cx={cx + offset} cy={cy} r={r} fill="none" stroke="#e8c15c" strokeWidth={strokeWidth} />
    </g>
  );
}
