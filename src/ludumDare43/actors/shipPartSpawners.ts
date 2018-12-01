import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'

import * as shipParts from './shipParts'
import * as anim from 'engine/anim/anim'
import * as spriteUtil from 'engine/anim/spriteUtil'

interface IShipParSpawner {
  x: number
  y: number
  elapsedSec: number
  anim: anim.IAnim
}
let items: IShipParSpawner[] = []

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(5, 1, 2, 2), spriteUtil.frame32(5, 2, 2, 2)],
  frameTime: 10 / 60,
}

export function create() {
  let ctx = getContext()

  log.x('create ship part spawner')
  let item: IShipParSpawner = {
    x: 600,
    y: 200,
    elapsedSec: 0,
    anim: anim.create(),
  }

  let sprite = ctx.createSprite('ship-001', animDefault.frames[0], 0.5, 0.5, 1)
  item.anim.sprite = sprite
  ctx.layerAbove.addChild(sprite)

  items.push(item)
  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    
    c.elapsedSec += elapsedTimeSec

    c.anim.sprite.x = c.x + 20
    c.anim.sprite.y = c.y

    if (c.elapsedSec > 1) {
      c.elapsedSec = 0
      let shipPart = shipParts.create()
      shipPart.anim.sprite.x = c.x
      shipPart.anim.sprite.y = c.y + _.random(-5, 5, true)
    }
  })
}
