// Fisher–Yates shuffle. Returns a new array; the source is never mutated. `random`
// defaults to Math.random but can be injected for deterministic tests.
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const temp = result[i]!
    result[i] = result[j]!
    result[j] = temp
  }
  return result
}
