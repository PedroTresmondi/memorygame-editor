export function snapToGrid(value: number, gridSize = 10): number {
  return Math.round(value / gridSize) * gridSize;
}
