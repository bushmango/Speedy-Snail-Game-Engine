import * as shipParts from './shipParts'
import * as shipPartsData from './shipPartsData'
import { IShipPart } from './shipParts'
import { _ } from 'engine/importsEngine'

import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as rockets from './rockets'
import * as chroma from 'chroma-js'

export interface IEnemyShip {
  shipGrid: shipParts.IShipPart[]
  smoothMover: smoothMoves.ISmoothMover
  x: number
  y: number

  dir: number
  v: number
  yo: number
  xo: number
  isDead: boolean
  tint: number
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
  let yo = _.random(150, cv.cameraHeight - 150)
  let xo = _.random(-50, 50)
  let item: IEnemyShip = {
    shipGrid: [],
    x: x,
    y: y,
    smoothMover: smoothMoves.create(x, y),
    dir: _.random(0, 1, false),
    v: _.random(5, 50),
    yo: yo,
    xo: xo,

    isDead: false,
    tint: chroma
      .random()
      .brighten(1)
      .num(),
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

    enemyShip.isDead = true
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
      if (
        c.flipped
          ? c.data.noLeft
          : c.data.noRight || sg.flipped
          ? sg.data.noRight
          : sg.data.noLeft
      ) {
        return false
      }
      break
    case 2:
      if (c.data.noBottom || sg.data.noTop) {
        return false
      }
      break
    case 3:
      if (
        c.flipped
          ? c.data.noRight
          : c.data.noLeft || sg.flipped
          ? sg.data.noLeft
          : sg.data.noRight
      ) {
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

export function attachNewPart(
  c: IEnemyShip,
  name: string,
  bx,
  by,
  flip: boolean = false
) {
  let f = _.find(
    shipPartsData.datas,
    (c: shipPartsData.IShipPartData) => c.name === name
  )
  if (!f) {
    throw 'cant find part ' + name
  }
  let sp = shipParts.create(f, c.tint)

  if (flip) {
    shipParts.flip(sp)
  }

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
    let margin = 150
    if (c.dir === 0) {
      4
      c.yo += c.v * elapsedTimeSec
      if (c.yo > cv.cameraHeight - margin) {
        c.dir = 1
      }
    } else {
      c.yo -= c.v * elapsedTimeSec
      if (c.yo < margin) {
        c.dir = 0
      }
    }

    smoothMoves.moveTo(
      c.smoothMover,
      cv.cameraWidth / 2 - 50 + 200 + c.xo,
      //cv.cameraHeight / 2 +
      c.yo
    )
    smoothMoves.update(c.smoothMover, c, elapsedTimeSec)

    let numParts = 0
    // Update all pieces
    _.forEach(c.shipGrid, (sp) => {
      if (sp) {
        numParts++

        if (sp.data.special === 'laser') {
          if (sp.isReadyToFire) {
            sp.isReadyToFire = false
            sp.elapsedRecharge = 0 - _.random(1, 3, true)
            let i = rockets.create('laser', true)
            i.launchedFrom = sp
            anim.copyPosition(i.anim, sp.anim)
            i.anim.sprite.x -= 16
          }
        }

        // 33sp.elapsedSec = 10
        // log.x('xy', c.x, c.y)

        // sp.anim.sprite.x = c.x
        // sp.anim.sprite.y = c.y
        //log.x(sp)
        //sp.anim.sprite.x = 100
        //sp.anim.sprite.y = 100
        sp.anim.sprite.x = c.x + (sp.bx - centerShipGridX) * 28
        sp.anim.sprite.y = c.y + (sp.by - centerShipGridY) * 28

        if (sp.safeDebris.length > 0) {
          _.forEach(sp.safeDebris, (deb) => {
            deb.tx = sp.anim.sprite.x + deb.ox
            deb.ty = sp.anim.sprite.y + deb.oy
            deb.anim.sprite.x = deb.tx
            deb.anim.sprite.y = deb.ty
          })
        }

        // sp.anim.sprite.x = sp.bx + 32 //+ sp.bx
        // sp.anim.sprite.y = sp.by //+ sp.by
      }
    })
    if (!numParts) {
      c.isDead = true // no parts!
    }
  })

  removeDead()
}

export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill enemy ship', c)
      //ctx.layerPlayer.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}
