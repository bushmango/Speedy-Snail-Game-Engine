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
  name: 'tailPart',
}

export interface ITailPart extends IActor {
  anim: anim.IAnim
  bx: number
  by: number
}

let items: ITailPart[] = []
function getAll() {
  return items
}

function create() {
  log.x('create', meta.name)
  let ctx = getContext()
  let item: ITailPart = {
    anim: anim.create(),
    bx: 0,
    by: 0,
  }

  let frame = spriteUtil.frame32(2, 2)
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
  })

  removeDead()
}

function explode(c: ITailPart) {
  if (c.isDead) {
    return
  }

  smashedShipParts.create(c.anim.sprite)
  powerPellets.create(c.bx, c.by)

  kill(c)
}
function kill(c: ITailPart) {
  c.isDead = true
}

function destroyAll() {
  _.forEach(items, (c) => {
    kill(c)
  })
  removeDead()
}

function removeDead() {
  actors.removeDead(meta, items, (c) => {
    let ctx = getContext()
    ctx.layerPlayer.removeChild(c.anim.sprite)
  })
}

export const tailParts = {
  meta,
  getAll,
  create,
  updateAll,
  explode,
  destroyAll,
  kill,
}
