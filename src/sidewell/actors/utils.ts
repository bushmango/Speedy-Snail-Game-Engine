import { _ } from 'engine/importsEngine'
import * as log from 'engine/log'

interface IIsDead {
  isDead: boolean
}

export function removeDead<T extends IIsDead>(
  items: T[],
  name: string,
  onDead?: (c: T) => void
) {
  // let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      // log.x('kill part', name)
      if (onDead) {
        onDead(c)
      }
      // ctx.layerAbove.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}
