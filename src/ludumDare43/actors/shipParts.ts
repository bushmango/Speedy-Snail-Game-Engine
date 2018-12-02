import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'
import * as asteroids from './asteroids'
import * as smashedParts from './smashedParts'
import * as goats from './goats'
import * as debris from './debris'
import * as utils from './utils'
import * as rockets from './rockets'

import {
  IShipPartData,
  datas,
  spawnableDatas,
  shipPart1,
} from './shipPartsData'
import { glCore } from 'pixi.js'
export { datas, spawnableDatas }

export interface IShipPart {
  anim: anim.IAnim
  isFree: boolean
  isDead: boolean
  isCore: boolean
  isConnectedToCore: boolean
  data: IShipPartData
  bx: number
  by: number
  vx: number
  vy: number
}
let items: IShipPart[] = []
export function getAll() {
  return items
}

let hoveredGoat: goats.IGoat = null
let tractoredPart: IShipPart = null
let hoveredPart: IShipPart = null

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

export function create(data: IShipPartData = shipPart1) {
  let ctx = getContext()

  log.x('create ship part')
  let item: IShipPart = {
    anim: anim.create(),
    isFree: true,
    isDead: false,
    data: data,
    bx: -1,
    by: -1,
    isCore: false,
    isConnectedToCore: false,
    vx: 0,
    vy: 0,
  }

  let sprite = ctx.createSprite('ship-001', data.frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    let goat = goats.getItem()

    if (item.isFree && !goat.isFree) {
      sprite.tint = 0xcccccc
      tractoredPart = item
    } else {
      sprite.tint = 0xff0000
      hoveredPart = item
    }
  })
  sprite.on('mouseout', () => {
    if (item.isFree) {
      sprite.tint = 0xffffffff
    } else {
      sprite.tint = 0xffffffff
      if (hoveredPart === item) {
        hoveredPart = null
      }
    }
  })

  ctx.layerPlayer.addChild(sprite)

  // anim.playAnim(item.anim, animRun)
  items.push(item)
  return item
}

export function switchDataTo(c: IShipPart, data: IShipPartData) {
  c.data = data
  c.anim.sprite.texture.frame = data.frame
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let mouse = ctx.sge.getMouse()

  if (mouse.isLeftJustDown) {
    if (hoveredPart && !hoveredPart.isDead && !hoveredPart.isFree) {
      //destroyFixedPiece(hoveredPart)
      //hoveredPart = null

      if (hoveredPart.data.special === 'rocket') {
        switchDataTo(hoveredPart, hoveredPart.data.clickTo)
        let i = rockets.create('rocket')
        i.launchedFrom = hoveredPart
        anim.copyPosition(i.anim, hoveredPart.anim)
      }
      if (hoveredPart.data.special === 'laser') {
        //switchDataTo(hoveredPart, hoveredPart.data.clickTo)
        let i = rockets.create('laser')
        i.launchedFrom = hoveredPart
        anim.copyPosition(i.anim, hoveredPart.anim)
        i.anim.sprite.x += 16
      }
    }
  }

  if (mouse.isRightDown) {
    if (hoveredPart && !hoveredPart.isDead) {
      destroyFixedPiece(hoveredPart)
      hoveredPart = null
    }
  }

  let goat = goats.getItem()

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    if (c.isFree) {
      if (tractoredPart === c && !goat.isFree) {
        let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
        c.anim.sprite.x += (cx - c.anim.sprite.x) * 0.1 * elapsedTimeSec * 60.0
        c.anim.sprite.y += (cy - c.anim.sprite.y) * 0.1 * elapsedTimeSec * 60.0
      } else {
        c.anim.sprite.x -= elapsedTimeSec * (50 + c.vx)
        c.anim.sprite.y -= elapsedTimeSec * c.vy

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
  if (tractoredPart && !tractoredPart.isDead) {
    _.forEach(asteroids.getAll(), (d) => {
      if (d.isDead) {
        return
      }
      if (
        utils.checkCirclesCollide(
          tractoredPart.anim.sprite.x,
          tractoredPart.anim.sprite.y,
          r,
          d.anim.sprite.x,
          d.anim.sprite.y,
          r * d.data.size
        )
      ) {
        getContext().sfx.playPartDestroyed()
        smash(tractoredPart)
        asteroids.smash(d)

        cameras.shake(ctx.camera, 0.25, 2)
      }
    })
  }

  _.forEach(items, (c) => {
    if (c.isDead) {
      return
    }
    if (!c.isFree) {
      if (c.isCore) {
        // Connect with goat
        let goat = goats.getItem()
        if (goat.isPickedUp) {
          if (
            utils.checkCirclesCollide(
              c.anim.sprite.x,
              c.anim.sprite.y,
              r,
              goat.anim.sprite.x,
              goat.anim.sprite.y,
              r
            )
          ) {
            goat.isFree = false
            goat.tx = c.anim.sprite.x
            goat.ty = c.anim.sprite.y
            goat.isPickedUp = false
          }
        }

        // Check for close asteroids
      }

      // See if we collide with asteroids
      _.forEach(asteroids.getAll(), (d) => {
        if (d.isDead) {
          return
        }
        if (
          utils.checkCirclesCollide(
            c.anim.sprite.x,
            c.anim.sprite.y,
            r,
            d.anim.sprite.x,
            d.anim.sprite.y,
            r * d.data.size
          )
        ) {
          cameras.shake(ctx.camera, 0.25, 5)

          destroyFixedPiece(c)
          asteroids.smash(d)
        }

        // check for close asteroids
        if (c.isCore && !c.isDead) {
          let distanceSimple = getDistanceSimple2(
            c.anim.sprite.x,
            c.anim.sprite.y,
            d.anim.sprite.x,
            d.anim.sprite.y
          )
          let target = r + r * d.data.size
          let factor = 3.5
          let maxTarget = target * factor
          if (distanceSimple < maxTarget) {
            let dist = maxTarget - target
            let z = distanceSimple - target
            let zp = z / dist

            cameras.frameSlowdown(ctx.camera, 0.1, 0.15 + zp * 0.85)
          }
        }
      })

      // See if we collide with the tractored part
      if (tractoredPart && !tractoredPart.isDead) {
        if (
          utils.checkCirclesCollide(
            c.anim.sprite.x,
            c.anim.sprite.y,
            r,
            tractoredPart.anim.sprite.x,
            tractoredPart.anim.sprite.y,
            r
          )
        ) {
          // whats the closest side?
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
              if (tractoredPart.data.noLeft || c.data.noRight) {
                isAllowed = false
              }
              ox = 32
              obx = 1
            } else {
              if (tractoredPart.data.noRight || c.data.noLeft) {
                isAllowed = false
              }
              ox = -32
              obx = -1
            }
          } else {
            if (dy > 0) {
              if (tractoredPart.data.noTop || c.data.noBottom) {
                isAllowed = false
              }
              oy = 32
              oby = 1
            } else {
              if (tractoredPart.data.noBottom || c.data.noTop) {
                isAllowed = false
              }
              oy = -32
              oby = -1
            }
          }

          // log.x(
          //   // attach,
          //   oy,
          //   oby,
          //   ox,
          //   obx,
          //   isAllowed,
          //   c[attach],
          //   safeGetShipGrid(c.bx + obx, c.by + oby),
          //   c.bx + obx,
          //   c.by + oby
          // )

          if (isAllowed) {
            if (null === safeGetShipGrid(c.bx + obx, c.by + oby)) {
              // valid and nothing here
              // Nothing already attached
              // connect it!
              tractoredPart.isFree = false
              tractoredPart.anim.sprite.tint = 0xff999999
              tractoredPart.anim.sprite.x = c.anim.sprite.x + ox
              tractoredPart.anim.sprite.y = c.anim.sprite.y + oy
              safeSetShipGrid(c.bx + obx, c.by + oby, tractoredPart)

              hoveredPart = tractoredPart
              tractoredPart = null

              getContext().sfx.playPartConnected()

              cameras.shake(ctx.camera, 0.1, 1)
            }
          }
        }
      }
    }
  })
}

export function destroyFixedPiece(c: IShipPart) {
  if (!c.isDead) {
    getContext().sfx.playPartDestroyed()

    if (c.data.damagesTo) {
      switchDataTo(c, c.data.damagesTo)
      return
    }

    smash(c)
    safeSetShipGrid(c.bx, c.by, null)

    // if (c.data.damagesTo) {
    //   let dp = create(c.data.damagesTo)
    //   dp.anim.sprite.x =
    //   safeSetShipGrid(c.bx, c.by, dp)
    //   return
    // }

    // Flood fill core to make sure everything is connected

    if (c.isCore) {
      goats.eject()
    }

    // Reset
    _.forEach(items, (c) => {
      c.isConnectedToCore = false
    })
    // Get core
    let core = _.find(
      items,
      (c: IShipPart) => c.isCore && !c.isFree && !c.isDead
    )

    if (core) {
      core.isConnectedToCore = true // let's hope so!

      // Recursively try to connect everything
      tryConnectToCore(core, 0)
      tryConnectToCore(core, 1)
      tryConnectToCore(core, 2)
      tryConnectToCore(core, 3)
    }

    _.forEach(items, (c) => {
      if (!c.isFree && !c.isDead) {
        if (!c.isConnectedToCore) {
          // Free!
          c.isFree = true

          c.vy = -(c.by - maxShipGridY / 2) * 5 + _.random(-2, 2, true)
          c.vx = _.random(-2, 2, true)

          if (c === safeGetShipGrid(c.bx, c.by)) {
            safeSetShipGrid(c.bx, c.by, null)
          }
        }
      }
    })
  }
}

function tryConnectToCore(c: IShipPart, dir) {
  // if (!c.isConnectedToCore) {
  //   return
  // }
  let ox = 0
  let oy = 0
  switch (dir) {
    case 0:
      oy = -1
      break
    case 1:
      ox = 1
      break
    case 2:
      oy = 1
      break
    case 3:
      ox = -1
      break
  }

  let sg = safeGetShipGrid(c.bx + ox, c.by + oy)
  if (!sg || sg.isConnectedToCore || sg.isDead) {
    return false // No part or already flood filled
  }
  switch (dir) {
    case 0:
      if (c.data.noTop || sg.data.noBottom) {
        return false
      }
      break
    case 1:
      if (c.data.noRight || sg.data.noLeft) {
        return false
      }
      break
    case 2:
      if (c.data.noBottom || sg.data.noTop) {
        return false
      }
      break
    case 3:
      if (c.data.noLeft || sg.data.noRight) {
        return false
      }
      break
  }
  // Everything seems good
  sg.isConnectedToCore = true
  // Recurse
  tryConnectToCore(sg, 0)
  tryConnectToCore(sg, 1)
  tryConnectToCore(sg, 2)
  tryConnectToCore(sg, 3)
}

export function smash(c: IShipPart) {
  if (!c.isDead) {
    smashedParts.create(c.anim.sprite)

    if (c.data.special === 'snails') {
      for (let i = 0; i < 3; i++) {
        let d = debris.create()
        d.anim.sprite.x = c.anim.sprite.x
        d.anim.sprite.y = c.anim.sprite.y
      }
    }

    c.isDead = true
  }
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

function getDistanceSimple2(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1)
  let dy = Math.abs(y2 - y1)
  return dx + dy * 2
}
