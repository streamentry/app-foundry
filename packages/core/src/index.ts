/** Pure, platform-independent demo logic. Replace with proven shared behavior. */
export function increment(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError('Count must be finite');
  return value + 1;
}

export function formatCount(value: number): string {
  return String(value);
}
