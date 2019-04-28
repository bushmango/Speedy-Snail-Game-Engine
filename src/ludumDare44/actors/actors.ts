import * as log from 'engine/log'

export interface IActor {
  isDead?: boolean
}

function removeDead<T extends IActor>(
  name: string,
  items: T[],
  cleanup: (c: T) => void
) {
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill', name, c)

      cleanup(c)

      items.splice(i, 1)
      i--
    }
  }
}

export const actors = {
  removeDead,
}
