import { BASE_FIGURE_CELL } from "../utils/gameConstants"

// CHQ: Claude AI (Sonnet) edited - wedding theme: bride silhouette (veil + gown)
// instead of a plain stick figure. Keeps the same scale-to-cellSize approach.
export const StickFigure: React.FC<{
  x: number;
  y: number;
  cellSize: number
}> = ({ x, y, cellSize }) => {
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  const scale = cellSize / BASE_FIGURE_CELL;

  // Drawn around the origin for a 40px cell, then scaled to fit the current cell size.
  return (
    <g
      transform={
        `translate(${cx}, ${cy}) scale(${scale})`
      }>
      {/* Veil, behind the head */}
      <path
        d="M 0 -10 L -9 12 L 9 12 Z"
        fill="#f7e9ee"
        stroke="#e8c7d6"
        strokeWidth={1}
        opacity={0.85}
      />

      {/* Gown */}
      <path
        d="M 0 -1 L -8 17 L 8 17 Z"
        fill="#ffffff"
        stroke="#c9a876"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      {/* Arms */}
      <line
        x1={0}
        y1={-1}
        x2={-6}
        y2={5}
        stroke="#ffffff"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke" />
      <line
        x1={0}
        y1={-1}
        x2={6}
        y2={5}
        stroke="#ffffff"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke" />
      {/* Head */}
      <circle
        cx={0}
        cy={-10}
        r={5.5}
        fill="#f4c9a0"
        stroke="#000"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke" />
      {/* Bouquet */}
      <circle
        cx={0}
        cy={7}
        r={2.6}
        fill="#e6a4c4"
        stroke="#c9789f"
        strokeWidth={0.75}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};