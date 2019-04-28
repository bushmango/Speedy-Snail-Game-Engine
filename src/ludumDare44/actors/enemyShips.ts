import { _ } from 'engine/importsEngine'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as chroma from 'chroma-js'
import { consts } from './consts'
import { enemyShipAi, IEnemyShipAi } from './enemyShipAi'
import { IActor, actors, IActorMeta } from './actors'
import { smashedShipParts } from './smashedShipParts'
import { background } from './background'
import { powerPellets } from './powerPellets'
import { ITailPart, tailParts } from './tailParts'

const meta: IActorMeta = {
  name: 'enemyShip',
}

export interface IEnemyShip extends IActor {
  ai: IEnemyShipAi
  anim: anim.IAnim
  smoothMover: smoothMoves.ISmoothMover
  bx: number
  by: number
  dir: number
  lastDir: number
  lastBx: number
  lastBy: number
  isDead: boolean
  isPlayer: boolean
  tint: number
  tails: ITailPart[]
}

let items: IEnemyShip[] = []
function getAll() {
  return items
}

function create() {
  log.x('create', meta.name)
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let item: IEnemyShip = {
    ai: enemyShipAi.create(),
    anim: anim.create(),
    bx: 0,
    by: 0,
    lastBx: 0,
    lastBy: 0,
    smoothMover: smoothMoves.create(0, 0),
    dir: 0,
    lastDir: 0,
    isDead: false,
    isPlayer: false,
    tint: chroma
      .random()
      .brighten(1)
      .num(),
    tails: [],
  }

  item.bx = _.random(0, consts.gridWidth - 1)
  item.by = _.random(0, consts.gridHeight - 1)
  item.dir = _.random(0, 4 - 1)
  item.lastDir = item.dir

  let frame = spriteUtil.frame32(1, 2)
  let sprite = ctx.createSprite('ship-001', frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

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
    if (!c.isPlayer) {
      enemyShipAi.update(c)
    }

    let { ox, oy } = consts.dirToOxy(c.dir)
    c.lastBx = c.bx
    c.lastBy = c.by
    c.lastDir = c.dir
    c.bx += ox
    c.by += oy

    // Move tails
    let lx = c.lastBx
    let ly = c.lastBy
    _.forEach(c.tails, (d) => {
      let lx2 = d.bx
      let ly2 = d.by
      d.bx = lx
      d.by = ly
      lx = lx2
      ly = ly2
    })

    // Check for out of bounds
    if (!background.inRange(c.bx, c.by)) {
      explode(c)
    }

    let t = background.getAt(c.bx, c.by)
    if (t.isDead) {
      explode(c)
    }

    // Check hit another player
    _.forEach(items, (d) => {
      if (d === c) {
        return // Skip ourself
      }

      if (d.bx === c.bx && d.by === c.by) {
        explode(d)
        explode(c)
      }
    })

    if (c.isDead) {
      return
    }

    // Check for hit power pellet
    _.forEach(powerPellets.getAll(), (d) => {
      if (!d.isDead && d.bx === c.bx && d.by === c.by) {
        powerPellets.eat(d)
        addTail(c)
      }
    })
  })
}

function explode(c: IEnemyShip) {
  if (c.isDead) {
    return
  }

  smashedShipParts.create(c.anim.sprite)
  powerPellets.create(c.lastBx, c.lastBy)

  _.forEach(c.tails, (d) => tailParts.explode(d))

  kill(c)
}
function kill(c: IEnemyShip) {
  if (c.isDead) {
    return
  }
  c.isDead = true
  _.forEach(c.tails, (d) => tailParts.kill(d))
}

function destroyAll() {
  _.forEach(items, (c) => {
    kill(c)
  })
  removeDead()
}

function addTail(c: IEnemyShip) {
  let t = tailParts.create()
  t.bx = c.bx
  t.by = c.by

  if (c.isPlayer) {
    anim.setFrame(t.anim, spriteUtil.frame32(2, 1))
  }

  c.tails.push(t)
}

function removeDead() {
  actors.removeDead(meta, items, (c) => {
    let ctx = getContext()
    ctx.layerPlayer.removeChild(c.anim.sprite)
  })
}

export const enemyShips = {
  meta,
  getAll,
  addTail,
  create,
  updateAll,
  explode,
  moveStep,
  destroyAll,
}
