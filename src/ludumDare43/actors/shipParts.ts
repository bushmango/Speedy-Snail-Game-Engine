import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'

interface IShipPart {
  anim: anim.IAnim
  isFree: boolean
  isDead: boolean

  aLeft: IShipPart
  aRight: IShipPart
  aTop: IShipPart
  aBottom: IShipPart
}
let items: IShipPart[] = []

let tractoredPart: IShipPart = null

interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
}

let datas: IShipPartData[] = []
let shipPart1: IShipPartData = {
  name: 'part-1',
  frame: spriteUtil.frame32(1, 1),
}
datas.push(shipPart1)
let shipPart2: IShipPartData = {
  name: 'part-2',
  frame: spriteUtil.frame32(1, 2),
}
datas.push(shipPart2)
let wing: IShipPartData = {
  name: 'wing-1',
  frame: spriteUtil.frame32(2, 1),
}
datas.push(wing)
let cockpit: IShipPartData = {
  name: 'cockpit-1',
  frame: spriteUtil.frame32(2, 2),
}
datas.push(cockpit)
let engine: IShipPartData = {
  name: 'engine-1',
  frame: spriteUtil.frame32(2, 3),
}
datas.push(engine)

export function create() {
  let ctx = getContext()

  log.x('create ship part')
  let item: IShipPart = {
    anim: anim.create(),
    isFree: true,
    isDead: false,
    aBottom: null,
    aTop: null,
    aLeft: null,
    aRight: null,
  }

  let sprite = ctx.createSprite('ship-001', engine.frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    if (item.isFree) {
      sprite.tint = 0xcccccccc
      tractoredPart = item
    }
  })
  sprite.on('mouseout', () => {
    if (item.isFree) {
      sprite.tint = 0xffffffff
    }
  })

  ctx.layerPlayer.addChild(sprite)

  // anim.playAnim(item.anim, animRun)
  items.push(item)
  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let mouse = ctx.sge.getMouse()

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    if (c.isFree) {
      if (tractoredPart === c) {
        let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
        c.anim.sprite.x += (cx - c.anim.sprite.x) * 0.1 * elapsedTimeSec * 60.0
        c.anim.sprite.y += (cy - c.anim.sprite.y) * 0.1 * elapsedTimeSec * 60.0
      } else {
        c.anim.sprite.x -= elapsedTimeSec * 50

        if (c.anim.sprite.x < 0) {
          c.isDead = true
        }
      }
    } else {
      // part of ship
    }

    // Destroy if off screen!!
  })

  removeDead()

  _.forEach(items, (c) => {
    if (!c.isFree) {
      // See if we collide with the tractored part
      let r = 32 / 2 - 1
      if (tractoredPart) {
        if (
          checkCirclesCollide(
            c.anim.sprite.x,
            c.anim.sprite.y,
            r,
            tractoredPart.anim.sprite.x,
            tractoredPart.anim.sprite.y,
            r
          )
        ) {
          // whats the closest side?
          let attach = null
          let ox = 0
          let oy = 0
          let dx = tractoredPart.anim.sprite.x - c.anim.sprite.x
          let adx = Math.abs(dx)
          let dy = tractoredPart.anim.sprite.y - c.anim.sprite.y
          let ady = Math.abs(dy)

          if (adx > ady) {
            if (dx > 0) {
              attach = 'aRight'
              ox = 32
            } else {
              attach = 'aLeft'
              ox = -32
            }
          } else {
            if (dy > 0) {
              attach = 'aBottom'
              oy = 32
            } else {
              attach = 'aTop'
              oy = -32
            }
          }

          if (!c[attach]) {
            // Nothing already attached
            // connect it!
            c[attach] = tractoredPart
            tractoredPart.isFree = false
            tractoredPart.anim.sprite.tint = 0xff999999
            tractoredPart.anim.sprite.x = c.anim.sprite.x + ox
            tractoredPart.anim.sprite.y = c.anim.sprite.y + oy
            tractoredPart = null
          }
        }
      }
    }
  })
}

export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill ship part', c)
      ctx.layerPlayer.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}

function checkCirclesCollide(x1, y1, r1, x2, y2, r2) {
  let dx = x2 - x1
  let dx2 = dx * dx
  let dy = y2 - y1
  let dy2 = dy * dy

  let rc = r1 + r2
  let rc2 = rc * rc

  return dx2 + dy2 < rc2
}
