// Round-robin merge: takes one item from each list in turn (list 0, list 1, …),
// then repeats — Food, Outdoor, Product, Food, Outdoor, Product… Lists that run
// out are skipped; each list's internal order is preserved. Pure and
// deterministic, so SSR and client render the identical sequence.
export function interleave<T>(lists: readonly (readonly T[])[]): T[] {
  const result: T[] = []
  const maxLength = Math.max(0, ...lists.map(list => list.length))

  for (let i = 0; i < maxLength; i++) {
    for (const list of lists) {
      const item = list[i]
      if (item !== undefined) result.push(item)
    }
  }

  return result
}
