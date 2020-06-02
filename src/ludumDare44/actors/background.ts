import { _ } from 'engine/importsEngine'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as chroma from 'chroma-js'
import { actors } from './actors'
import { consts } from './consts'
import { smashedShipParts } from './smashedShipParts'

const meta = {
  name: 'backgroundPart',
}

export interface IBackgroundPiece {
  anim: anim.IAnim
  bx: number
  by: number
  isDead: boolean
}

let destroyer = {
  bx: 0,
  by: 0,
  dir: 1,
  timeAccumulator: 0,
  timeAccumulatorMax: (60 * 5) / (32 * 32),
}

let items: IBackgroundPiece[] = []
let deadItems: IBackgroundPiece[] = []

let grid: IBackgroundPiece[] = []

function getAll() {
  return items
}

function create() {
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let item: IBackgroundPiece = {
    anim: anim.create(),
    bx: 0,
    by: 0,
    isDead: false,
  }

  let frame = spriteUtil.frame32(1, 3)
  let sprite = ctx.createSprite('ship-001', frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  ctx.layerBelow.addChild(sprite)

  items.push(item)
  return item
}

function createAll() {
  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      let c = create()
      c.bx = i
      c.by = j
      grid.push(c)
    }
  }
}

function reset() {
  destroyer.bx = 0
  destroyer.by = 0
  destroyer.dir = 1
  destroyer.timeAccumulator = 0
  _.forEach(items, (c) => {
    c.isDead = false
    c.anim.sprite.visible = true
  })
}

function inRange(bx, by) {
  if (bx < 0 || bx >= consts.gridWidth) {
    return false
  }
  if (by < 0 || by >= consts.gridHeight) {
    return false
  }
  return true
}
function getAt(bx, by) {
  if (!inRange(bx, by)) {
    return null
  }
  return grid[by * consts.gridWidth + bx]
}

function updateAll(elapsedTimeSec: number) {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  updateDestroyer(elapsedTimeSec)

  _.forEach(items, (c) => {
    c.anim.sprite.x = c.bx * consts.blockSize
    c.anim.sprite.y = c.by * consts.blockSize
  })

  removeDead()
}

function updateDestroyer(elapsedTimeSec) {
  // Increase our destroyer

  destroyer.timeAccumulator += elapsedTimeSec
  if (destroyer.timeAccumulator > destroyer.timeAccumulatorMax) {
    destroyer.timeAccumulator -= destroyer.timeAccumulatorMax

    let t = getAt(destroyer.bx, destroyer.by)
    if (t && !t.isDead) {
      explode(t)
    } else {
      // Reverse
      let { ox, oy } = consts.dirToOxy(destroyer.dir)
      destroyer.bx -= ox
      destroyer.by -= oy
      destroyer.dir = consts.turnRight(destroyer.dir)
    }

    let { ox, oy } = consts.dirToOxy(destroyer.dir)
    destroyer.bx += ox
    destroyer.by += oy
  }
}

function explode(c: IBackgroundPiece) {
  if (c.isDead) {
    return
  }

  smashedShipParts.create(c.anim.sprite)

  c.anim.sprite.visible = false
  c.isDead = true
}

function removeDead() {
  //actors.removeDead(meta, items, (c) => {
  //c.anim.sprite.visible = false
  // deadItems.push(c)
  //})
}

export const background = {
  getAll,
  create,
  createAll,
  updateAll,
  inRange,
  getAt,
  reset,
}