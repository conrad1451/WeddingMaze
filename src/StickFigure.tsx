import { BASE_FIGURE_CELL } from "./utils/gameConstants"

export const StickFigure: React.FC<{ x: number; y: number; cellSize: number }> = ({ x, y, cellSize }) => {
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  const scale = cellSize / BASE_FIGURE_CELL;
 
  const line = { stroke: '#000', strokeWidth: 2, strokeLinecap: 'round' as const, vectorEffect: 'non-scaling-stroke' as const };
 
  // Drawn around the origin for a 40px cell, then scaled to fit the current cell size.
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Head spans y -16..-4 */}
      <circle cx={0} cy={-10} r={6} fill="#ff6b6b" stroke="#000" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {/* Body */}
      <line x1={0} y1={-4} x2={0} y2={7} {...line} />
      {/* Arms */}
      <line x1={0} y1={-1} x2={-8} y2={3} {...line} />
      <line x1={0} y1={-1} x2={8} y2={3} {...line} />
      {/* Legs */}
      <line x1={0} y1={7} x2={-5} y2={17} {...line} />
      <line x1={0} y1={7} x2={5} y2={17} {...line} />
    </g>
  );
};
