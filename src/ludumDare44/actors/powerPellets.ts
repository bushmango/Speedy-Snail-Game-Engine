import { _ } from 'engine/importsEngine'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from 'engine/anim/anim'
import * as chroma from 'chroma-js'
import { consts } from './consts'
import { enemyShipAi, IEnemyShipAi } from './enemyShipAi'
import { IActor, actors, IActorMeta } from './actors'
import { smashedShipParts } from './smashedShipParts'
import { background } from './background'

const meta: IActorMeta = {
  name: 'powerPellet',
}

export interface IPowerPellet extends IActor {
  anim: anim.IAnim
  bx: number
  by: number
  isDead: boolean
}

let items: IPowerPellet[] = []
function getAll() {
  return items
}

function create(bx, by) {
  log.x('create', meta.name)
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let item: IPowerPellet = {
    anim: anim.create(),
    bx: bx,
    by: by,
    isDead: false,
  }

  let frame = spriteUtil.frame32(2, 3)
  let sprite = ctx.createSprite('ship-001', frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  ctx.layerAbove.addChild(sprite)

  items.push(item)
  return item
}

function updateAll(elapsedTimeSec: number) {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  _.forEach(items, (c) => {
    c.anim.sprite.x = c.bx * consts.blockSize
    c.anim.sprite.y = c.by * consts.blockSize

    let t = background.getAt(c.bx, c.by)
    if (!t || t.isDead) {
      eat(c)
    }
  })

  removeDead()
}

function eat(c: IPowerPellet) {
  if (c.isDead) {
    return false
  }
  c.isDead = true
  smashedShipParts.create(c.anim.sprite)
}

function removeDead() {
  actors.removeDead(meta, items, (c) => {
    let ctx = getContext()
    ctx.layerAbove.removeChild(c.anim.sprite)
  })
}

export const powerPellets = {
  meta,
  getAll,
  create,
  updateAll,
  eat,
}
