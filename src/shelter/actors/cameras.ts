import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as stats from 'pacrpg/stats'

const isActive = true

interface ICamera {
  container: PIXI.Container

  shakeX: 0
  shakeY: 0
  shakeFactor: 0
  shakeFramesLeft: 0

}
let items: ICamera[] = []

export function getAll() {
  return items
}

export function create() {
  let ctx = getContext()

  log.x('create camera')
  let item: ICoin = {
    anim: anim.create(),
    bx: 14,
    by: 18,
    x: 0,
    y: 0,
    isCollected: false,
    isDead: false,
  }

  let baseTex = ctx.sge.getTexture('player1')
  let tex = new PIXI.Texture(baseTex.baseTexture, animDefault.frames[0])

  let sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(1)
  ctx.layerPlayer.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  moveToB(item, 14, 18)

  anim.playAnim(item.anim, animDefault)

  return item
}



export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    if (c.isDead) {
      return
    }
    anim.update(c.anim, elapsedTime)
    if (c.isCollected) {
      if (c.anim.done) {
        c.isDead = true // Kill after animation finished
      }
    }
  })
  removeDead()
}

