// Deterministic shuffle: the same seed always yields the same order, so the
// server-rendered and client-hydrated markup match exactly (a Math.random-based
// shuffle would differ between the two and trigger a hydration mismatch).
// mulberry32 PRNG feeding a Fisher–Yates pass. Pure — never mutates the input.
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items]
  let state = seed >>> 0

  const next = (): number => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    const tmp = result[i]!
    result[i] = result[j]!
    result[j] = tmp
  }

  return result
}
