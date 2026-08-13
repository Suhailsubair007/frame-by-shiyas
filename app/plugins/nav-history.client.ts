import { useNavHistory } from '@/composables/useNavHistory'

// Record the route we're leaving before each navigation resolves, so the page
// we land on knows where the visitor came from.
export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { record } = useNavHistory()

  router.beforeEach((_to, from) => {
    record(from.path)
  })
})
