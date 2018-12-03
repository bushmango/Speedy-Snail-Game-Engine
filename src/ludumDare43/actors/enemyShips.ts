import * as shipParts from './shipParts'
import * as shipPartsData from './shipPartsData'
import { IShipPart } from './shipParts'
import { _ } from 'engine/importsEngine'

import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

export interface IEnemyShip {
  shipGrid: shipParts.IShipPart[]
  smoothMover: smoothMoves.ISmoothMover
  x: number
  y: number
}

let items: IEnemyShip[] = []
export function getAll() {
  return items
}

export function create() {
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let x = cv.cameraWidth - 100
  let y = cv.cameraHeight / 2
  let item: IEnemyShip = {
    shipGrid: [],
    x: x,
    y: y,
    smoothMover: smoothMoves.create(x, y),
  }
  for (let j = 0; j < maxShipGridY; j++) {
    for (let i = 0; i < maxShipGridX; i++) {
      item.shipGrid.push(null)
    }
  }
  items.push(item)
  return item
}

let maxShipGridX = 9
let maxShipGridY = 9
let centerShipGridX = 4
let centerShipGridY = 4

export { centerShipGridX, centerShipGridY }

// export function destroyFixedPiece(c: IShipPart) {
//   if (c.enemyShip) {
//     shipParts.destroyFixedPiece(c)
//     updateWhatsAttached(c.enemyShip)
//     c.enemyShip = null
//   }
// }

export function updateWhatsAttached(enemyShip: IEnemyShip) {
  // Reset
  _.forEach(enemyShip.shipGrid, (c) => {
    if (c) {
      c.isConnectedToCore = false
    }
  })
  // Get core
  let core = _.find(
    enemyShip.shipGrid,
    (c: IShipPart) => c && c.isCore && c.isAttachedToEnemy && !c.isDead
  )

  if (core) {
    core.isConnectedToCore = true // let's hope so!

    // Recursively try to connect everything
    tryConnectToCore(enemyShip, core, 0)
    tryConnectToCore(enemyShip, core, 1)
    tryConnectToCore(enemyShip, core, 2)
    tryConnectToCore(enemyShip, core, 3)
  } else {
    // goats.eject()
    // Eject babies?
  }

  _.forEach(enemyShip.shipGrid, (c) => {
    if (c) {
      if (c.isAttachedToEnemy && !c.isDead) {
        if (!c.isConnectedToCore) {
          // Free!
          c.isFree = true
          c.isAttachedToEnemy = false
          c.enemyShip = null

          c.vy = -(c.by - maxShipGridY / 2) * 5 + _.random(-2, 2, true)
          c.vx = _.random(-2, 2, true)

          if (c === safeGetShipGrid(enemyShip, c.bx, c.by)) {
            safeSetShipGrid(enemyShip, c.bx, c.by, null)
          }
        }
      }
    }
  })
}

function tryConnectToCore(enemyShip: IEnemyShip, c: IShipPart, dir) {
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

  let sg = safeGetShipGrid(enemyShip, c.bx + ox, c.by + oy)
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
  tryConnectToCore(enemyShip, sg, 0)
  tryConnectToCore(enemyShip, sg, 1)
  tryConnectToCore(enemyShip, sg, 2)
  tryConnectToCore(enemyShip, sg, 3)
}

export function attachNewPart(c: IEnemyShip, name: string, bx, by) {
  let f = _.find(
    shipPartsData.datas,
    (c: shipPartsData.IShipPartData) => c.name === name
  )
  if (!f) {
    throw 'cant find part ' + name
  }
  let sp = shipParts.create(f)
  safeSetShipGrid(c, bx, by, sp)

  if (name === 'core-1') {
    sp.isCore = true
  }

  return sp
}

export function safeGetShipGrid(c: IEnemyShip, x, y) {
  if (x < 0 || x >= maxShipGridX) {
    return false
  }
  if (y < 0 || y >= maxShipGridY) {
    return false
  }
  return c.shipGrid[y * maxShipGridX + x]
}
// export function setShipGridCenter(d: IEnemyShip, c: IShipPart) {
//   safeSetShipGrid(d, centerShipGridX, centerShipGridY, c)
// }
export function safeSetShipGrid(d: IEnemyShip, x, y, c: IShipPart) {
  if (x < 0 || x >= maxShipGridX) {
    return false
  }
  if (y < 0 || y >= maxShipGridY) {
    return false
  }
  d.shipGrid[y * maxShipGridX + x] = c
  if (c) {
    c.bx = x
    c.by = y
    c.enemyShip = d
    c.isFree = false
    c.isAttachedToEnemy = true
  }
  return true
}

export function updateAll(elapsedTimeSec: number) {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  _.forEach(items, (c) => {
    smoothMoves.moveTo(
      c.smoothMover,
      cv.cameraWidth / 2 - 50 + 200,
      cv.cameraHeight / 2
    )
    smoothMoves.update(c.smoothMover, c, elapsedTimeSec)

    // Update all pieces
    _.forEach(c.shipGrid, (sp) => {
      if (sp) {
        sp.elapsedSec = 10
        // log.x('xy', c.x, c.y)

        // sp.anim.sprite.x = c.x
        // sp.anim.sprite.y = c.y
        //log.x(sp)
        //sp.anim.sprite.x = 100
        //sp.anim.sprite.y = 100
        sp.anim.sprite.x = c.x + (sp.bx - centerShipGridX) * 28
        sp.anim.sprite.y = c.y + (sp.by - centerShipGridY) * 28

        // sp.anim.sprite.x = sp.bx + 32 //+ sp.bx
        // sp.anim.sprite.y = sp.by //+ sp.by
      }
    })
  })
}
