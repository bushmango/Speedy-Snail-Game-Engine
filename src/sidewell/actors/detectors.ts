import { _ } from 'engine/importsEngine'

import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as maps from './../map/maps'

const isActive = true

export interface IDetector {
  anim: anim.IAnim
  x: number
  y: number
  ox: number
  oy: number
}
let items: IDetector[] = []

var frames = [spriteUtil.frame32(1, 3)]

var animDefault: anim.IAnimData = {
  frames: frames,
  frameTime: 10 / 60,
}

export function create(ox, oy) {
  let ctx = getContext()
  log.x('create detector')
  let item: IDetector = {
    anim: anim.create(),
    x: 4,
    y: 4,
    ox: ox,
    oy: oy,
  }

  let baseTex = ctx.sge.getTexture('player1')

  var texs = _.map(frames, (c) => new PIXI.Texture(baseTex.baseTexture, c))
  var tex0 = texs[0]

  let sprite = new PIXI.Sprite(tex0)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(1)
  ctx.layerDetectors.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  anim.playAnim(item.anim, animDefault)

  return item
}

export function testAgainstMap(c: IDetector, tx, ty) {
  // let ctx = getContext()
  // let tile = maps.getTileAtWorld(ctx.map, tx + c.ox, ty + c.oy)
  // if (tile) {
  //   //    log.x(tile.tileData.t)
  //   if (tile.tileData.t === 9) {
  //     // Can't move
  //     return false
  //   } else {
  //     return true
  //   }
  // }
  return false
}

import { InputControl } from 'engine/gamepad/InputControl'
export function update(c: IDetector, sprite) {
  let elapsedTime = 1.0 / 60.0
  c.anim.sprite.x = sprite.x + c.ox
  c.anim.sprite.y = sprite.y + c.oy
  anim.update(c.anim, elapsedTime)
}
// export function updateAll() {
//   _.forEach(items, (c) => {
//     update(c)
//   })
// }
