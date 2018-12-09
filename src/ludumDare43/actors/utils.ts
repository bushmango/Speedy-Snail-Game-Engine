import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

interface IIsDead {
  isDead: boolean
}

export function removeDead<T extends IIsDead>(
  items: T[],
  name: string,
  onDead: (c: T) => void
) {
  // let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill part', name)
      onDead(c)
      // ctx.layerAbove.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}

export function checkCirclesCollide(x1, y1, r1, x2, y2, r2) {
  let dx = x2 - x1
  let dx2 = dx * dx
  let dy = y2 - y1
  let dy2 = dy * dy

  let rc = r1 + r2
  let rc2 = rc * rc

  return dx2 + dy2 < rc2
}

export function getDistanceSimple(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1)
  let dy = Math.abs(y2 - y1)
  return dx + dy
}

export function isOffScreen(
  cv: { cameraWidth: number; cameraHeight: number },
  sprite: PIXI.Sprite
) {
  if (
    sprite.x + sprite.texture.frame.width < 0 ||
    sprite.x - sprite.texture.frame.width > cv.cameraWidth
  ) {
    if (
      sprite.y + sprite.texture.frame.height < 0 ||
      sprite.y - sprite.texture.frame.height > cv.cameraHeight
    ) {
      return true
    }
  }
  return false
}
