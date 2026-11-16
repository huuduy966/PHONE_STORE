export function ratingFillPercent(value: number): number {
  return Math.floor(Math.min(5, Math.max(0, value)) * 2) * 10;
}
