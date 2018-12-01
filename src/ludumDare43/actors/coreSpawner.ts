import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'

import * as shipParts from './shipParts'
import * as anim from 'engine/anim/anim'
import * as spriteUtil from 'engine/anim/spriteUtil'

interface ICoreSpawner {
  x: number
  y: number
  elapsedSec: number
  anim: anim.IAnim
  hasPayload: boolean
}
let item: ICoreSpawner = null

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(5, 1, 2, 2), spriteUtil.frame32(5, 2, 2, 2)],
  frameTime: 10 / 60,
}

export function create() {
  let ctx = getContext()

  log.x('create core ship part spawner')
  item = {
    x: 0,
    y: 200,
    elapsedSec: 0,
    anim: anim.create(),
    hasPayload: false,
  }

  let sprite = ctx.createSprite('ship-001', animDefault.frames[0], 0.5, 0.5, 1)
  item.anim.sprite = sprite
  ctx.layerAbove.addChild(sprite)

  //items.push(item)
  return item
}

export function launch() {
  if (!item.hasPayload) {
    item.x = 0
    item.hasPayload = true
  }
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  //_.forEach(items, (c) => {
  let c = item
  c.elapsedSec += elapsedTimeSec

  c.x += 250 * elapsedTimeSec
  c.anim.sprite.x = c.x + 20
  c.anim.sprite.y = c.y

  if (c.hasPayload && c.x > 200) {
    // drop core

    let sp = shipParts.create()
    sp.isFree = false
    sp.isCore = true // Most important piece!
    sp.anim.sprite.x = 200
    sp.anim.sprite.y = 200
    shipParts.setShipGridCenter(sp)

    c.hasPayload = false
  }

  // if (c.elapsedSec > 1) {
  //   c.elapsedSec = 0

  //   let nextPart = _.sample(shipParts.spawnableDatas)

  //   let shipPart = shipParts.create(nextPart)
  //   shipPart.anim.sprite.x = c.x
  //   shipPart.anim.sprite.y = c.y + _.random(-5, 5, true)
  // }
  //})
}
