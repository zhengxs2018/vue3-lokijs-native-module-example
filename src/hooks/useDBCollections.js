import { reactive } from 'https://esm.sh/vue@next'

import db from '../lib/db.js'

export function useDBCollections() {
  const data = reactive(db.listCollections())

  const clear = () => {
    data.length = 0
  }

  const refresh = () => {
    clear()
    data.push(...db.listCollections())
  }

  return {
    data,
    refresh,
    clear
  }
}
