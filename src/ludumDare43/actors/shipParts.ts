import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'
import * as asteroids from './asteroids'

interface IShipPart {
  anim: anim.IAnim
  isFree: boolean
  isDead: boolean

  aLeft: IShipPart
  aRight: IShipPart
  aTop: IShipPart
  aBottom: IShipPart

  data: IShipPartData
  bx: number
  by: number
}
let items: IShipPart[] = []

let tractoredPart: IShipPart = null

let shipGrid: IShipPart[] = []
let maxShipGridX = 9
let maxShipGridY = 9
for (let j = 0; j < maxShipGridY; j++) {
  for (let i = 0; i < maxShipGridX; i++) {
    shipGrid.push(null)
  }
}
export function safeGetShipGrid(x, y) {
  if (x < 0 || x >= maxShipGridX) {
    return false
  }
  if (y < 0 || y >= maxShipGridY) {
    return false
  }
  return shipGrid[y * maxShipGridX + x]
}
export function setShipGridCenter(c: IShipPart) {
  safeSetShipGrid(Math.floor(maxShipGridX / 2), Math.floor(maxShipGridY / 2), c)
  log.x(shipGrid)
}
export function safeSetShipGrid(x, y, c: IShipPart) {
  if (x < 0 || x >= maxShipGridX) {
    return false
  }
  if (y < 0 || y >= maxShipGridY) {
    return false
  }
  shipGrid[y * maxShipGridX + x] = c
  if (c) {
    c.bx = x
    c.by = y
    c.isFree = false
  }
  return true
}

interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
  noLeft?: boolean
  noRight?: boolean
  noTop?: boolean
  noBottom?: boolean
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
  noRight: true,
  noTop: true,
}
datas.push(wing)
let wing2: IShipPartData = {
  name: 'wing-2',
  frame: spriteUtil.frame32(3, 1),
  noRight: true,
  noBottom: true,
}
datas.push(wing2)
let cockpit: IShipPartData = {
  name: 'cockpit-1',
  frame: spriteUtil.frame32(2, 2),
  noRight: true,
  noTop: true,
  noBottom: true,
}
datas.push(cockpit)
let engine: IShipPartData = {
  name: 'engine-1',
  frame: spriteUtil.frame32(2, 3),
  noLeft: true,
}
datas.push(engine)

export { datas }

export function create(data: IShipPartData = shipPart1) {
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
    data: data,
    bx: -1,
    by: -1,
  }

  let sprite = ctx.createSprite('ship-001', data.frame, 0.5, 0.5, 1)
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

  let r = 32 / 2 - 1
  if (tractoredPart) {
    _.forEach(asteroids.getAll(), (d) => {
      if (
        checkCirclesCollide(
          tractoredPart.anim.sprite.x,
          tractoredPart.anim.sprite.y,
          r,
          d.anim.sprite.x,
          d.anim.sprite.y,
          r * d.data.size
        )
      ) {
        tractoredPart.isDead = true
        d.isDead = true
        cameras.shake(ctx.camera, 0.25, 2)
      }
    })
  }

  _.forEach(items, (c) => {
    if (!c.isFree) {
      // See if we collide with asteroids
      _.forEach(asteroids.getAll(), (d) => {
        if (
          checkCirclesCollide(
            c.anim.sprite.x,
            c.anim.sprite.y,
            r,
            d.anim.sprite.x,
            d.anim.sprite.y,
            r * d.data.size
          )
        ) {
          cameras.shake(ctx.camera, 0.25, 5)

          c.isDead = true
          d.isDead = true
          // TODO break apart ship

          let sg = safeGetShipGrid(c.bx - 1, c.by)
          if (sg) {
            sg.aRight = null
          }
          sg = safeGetShipGrid(c.bx + 1, c.by)
          if (sg) {
            sg.aLeft = null
          }
          sg = safeGetShipGrid(c.bx, c.by - 1)
          if (sg) {
            sg.aBottom = null
          }
          sg = safeGetShipGrid(c.bx, c.by + 1)
          if (sg) {
            sg.aTop = null
          }
          safeSetShipGrid(c.bx, c.by, null)
        }
      })

      // See if we collide with the tractored part
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
          let isAllowed = true
          let ox = 0
          let obx = 0
          let oy = 0
          let oby = 0
          let dx = tractoredPart.anim.sprite.x - c.anim.sprite.x
          let adx = Math.abs(dx)
          let dy = tractoredPart.anim.sprite.y - c.anim.sprite.y
          let ady = Math.abs(dy)

          if (adx > ady) {
            if (dx > 0) {
              attach = 'aRight'
              if (tractoredPart.data.noLeft || c.data.noRight) {
                isAllowed = false
              }
              ox = 32
              obx = 1
            } else {
              attach = 'aLeft'
              if (tractoredPart.data.noRight || c.data.noLeft) {
                isAllowed = false
              }
              ox = -32
              obx = -1
            }
          } else {
            if (dy > 0) {
              attach = 'aBottom'
              if (tractoredPart.data.noTop || c.data.noBottom) {
                isAllowed = false
              }
              oy = 32
              oby = 1
            } else {
              attach = 'aTop'
              if (tractoredPart.data.noBottom || c.data.noTop) {
                isAllowed = false
              }
              oy = -32
              oby = -1
            }
          }

          log.x(
            attach,
            oy,
            oby,
            ox,
            obx,
            isAllowed,
            c[attach],
            safeGetShipGrid(c.bx + obx, c.by + oby),
            c.bx + obx,
            c.by + oby
          )

          if (!c[attach] && isAllowed) {
            if (null === safeGetShipGrid(c.bx + obx, c.by + oby)) {
              // valid and nothing here
              // Nothing already attached
              // connect it!
              c[attach] = tractoredPart
              tractoredPart.isFree = false
              tractoredPart.anim.sprite.tint = 0xff999999
              tractoredPart.anim.sprite.x = c.anim.sprite.x + ox
              tractoredPart.anim.sprite.y = c.anim.sprite.y + oy
              safeSetShipGrid(c.bx + obx, c.by + oby, tractoredPart)
              tractoredPart = null

              cameras.shake(ctx.camera, 0.1, 1)
            }
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
