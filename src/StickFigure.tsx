import { CELL_SIZE } from "./utils/gameConstants"

export const StickFigure: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const cx = x * CELL_SIZE + CELL_SIZE / 2;
  const cy = y * CELL_SIZE + CELL_SIZE / 2;

  const headRadius = 6;
  const headY = cy - 10; // head spans cy-16 .. cy-4
  const neckY = headY + headRadius; // body starts where the head ends
  const hipY = cy + 7;
  const shoulderY = neckY + 3;

  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={headY} r={headRadius} fill="#ff6b6b" stroke="#000" strokeWidth="1" />
      {/* Body */}
      <line x1={cx} y1={neckY} x2={cx} y2={hipY} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Arms */}
      <line x1={cx} y1={shoulderY} x2={cx - 8} y2={shoulderY + 4} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={shoulderY} x2={cx + 8} y2={shoulderY + 4} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <line x1={cx} y1={hipY} x2={cx - 5} y2={hipY + 10} stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={hipY} x2={cx + 5} y2={hipY + 10} stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};