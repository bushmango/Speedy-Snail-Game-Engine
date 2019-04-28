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

const meta: IActorMeta = {
  name: 'enemyShip',
}

export interface IEnemyShip extends IActor {
  ai: IEnemyShipAi
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
  log.x('create', meta.name)
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let x = cv.cameraWidth - 100
  let y = cv.cameraHeight / 2
  let yo = _.random(150, cv.cameraHeight - 150)
  let xo = _.random(-50, 50)
  let item: IEnemyShip = {
    ai: enemyShipAi.create(),
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

  let frame = spriteUtil.frame32(1, 2)
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
    enemyShipAi.update(c)

    let { ox, oy } = consts.dirToOxy(c.dir)
    c.bx += ox
    c.by += oy

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
      }
    })
  })
}

function explode(c: IEnemyShip) {
  if (c.isDead) {
    return
  }

  smashedShipParts.create(c.anim.sprite)
  powerPellets.create(c.bx, c.by)

  c.isDead = true
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
  create,
  updateAll,
  explode,
  moveStep,
}
