// Remembers the path we navigated away from, so a page can react to where the
// visitor came from (e.g. returning home lands on the section that linked out).
const previousPath = ref<string>('/')

export function useNavHistory() {
  function record(path: string): void {
    previousPath.value = path
  }

  return { previousPath: readonly(previousPath), record } as const
}
