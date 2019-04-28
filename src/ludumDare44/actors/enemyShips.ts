import { _ } from 'engine/importsEngine'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as chroma from 'chroma-js'
import { consts } from './consts'

export interface IEnemyShip {
  anim: anim.IAnim
  smoothMover: smoothMoves.ISmoothMover
  bx: number
  by: number
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
function getAll() {
  return items
}

function create() {
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let x = cv.cameraWidth - 100
  let y = cv.cameraHeight / 2
  let yo = _.random(150, cv.cameraHeight - 150)
  let xo = _.random(-50, 50)
  let item: IEnemyShip = {
    anim: anim.create(),
    bx: 0,
    by: 0,
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

  item.bx = _.random(0, consts.gridWidth - 1)
  item.by = _.random(0, consts.gridHeight - 1)
  item.dir = _.random(0, 4 - 1)

  let frame = spriteUtil.frame32(1, 1)
  let sprite = ctx.createSprite('ship-001', frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  // sprite.interactive = true
  // sprite.buttonMode = true
  // sprite.on('mouseover', () => {
  //   if (item.isFree) {
  //     sprite.tint = 0xcccccccc
  //     tractoredPart = item
  //   }
  // })
  // sprite.on('mouseout', () => {
  //   if (item.isFree) {
  //     sprite.tint = 0xffffffff
  //   }
  // })

  ctx.layerPlayer.addChild(sprite)

  items.push(item)
  return item
}

function updateAll(elapsedTimeSec: number) {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  _.forEach(items, (c) => {
    c.anim.sprite.x = c.bx * consts.blockSize
    c.anim.sprite.y = c.by * consts.blockSize
    c.anim.sprite.rotation = (c.dir * Math.PI) / 2
  })

  removeDead()
}

function moveStep() {
  _.forEach(items, (c) => {
    let ox = 0
    let oy = 0
    switch (c.dir) {
      case 0:
        ox = 0
        oy = -1
        break
      case 1:
        ox = 1
        oy = 0
        break
      case 2:
        ox = 0
        oy = 1
        break
      case 3:
        ox = -1
        oy = 0
        break
    }
    c.bx += ox
    c.by += oy

    // Check for out of bounds
    if (c.bx < 0 || c.bx >= consts.gridWidth) {
      explode(c)
    }
    if (c.by < 0 || c.by >= consts.gridWidth) {
      explode(c)
    }
  })
}

function explode(c: IEnemyShip) {
  if (c.isDead) {
    return
  }

  c.isDead = true
}

function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill enemy ship', c)

      ctx.layerPlayer.removeChild(c.anim.sprite)

      items.splice(i, 1)
      i--
    }
  }
}

export const enemyShips = {
  getAll,
  create,
  updateAll,
  explode,
  moveStep,
}
