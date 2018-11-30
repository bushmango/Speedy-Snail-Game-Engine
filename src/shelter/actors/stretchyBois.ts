import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as stats from 'pacrpg/stats'

const isActive = true

export interface IStretchyBoi {
  anim: anim.IAnim
  frame: number
  bx: number
  by: number
}
let items: IStretchyBoi[] = []

export function getAll() {
  return items
}

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(3, 1, 2),
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
  let ctx = getContext()

  log.x('create stretchy boi')

  let item: IStretchyBoi = {
    anim: anim.create(),
    frame: 0,
    bx: 7,
    by: 7,
  }

  let baseTex = ctx.sge.getTexture('player1')
  let tex = new PIXI.Texture(baseTex.baseTexture, animDefault.frames[0])

  let sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0.5, 1)
  sprite.y = 200
  sprite.x = 250
  sprite.scale.set(1)
  ctx.layerPlayer.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  // moveToB(item, 14, 18)

  anim.playAnim(item.anim, animDefault)

  return item
}

// export function moveToB(item: IEnemy, bx, by) {
//   item.bx = bx
//   item.by = by
//   item.x = item.bx * 32 + 16
//   item.y = item.by * 32 + 16
//   item.anim.sprite.x = item.x
//   item.anim.sprite.y = item.y
// }

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    c.frame += elapsedTimeSec

    //let frameSpeed = 120
    let frameQ = c.frame
    let min = 0.5
    let max = 1.25
    let size = max - min
    let sin = Math.abs(Math.sin(frameQ * Math.PI * 2)) * size + min
    let cos = Math.abs(Math.cos(frameQ * Math.PI * 2 + Math.PI)) * size + min
    c.anim.sprite.scale.set(sin, cos)
  })
}
