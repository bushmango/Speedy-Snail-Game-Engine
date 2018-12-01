import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

interface IGoat {
  anim: anim.IAnim
}
//let items: IGoat[] = []
let item: IGoat = null

export function getItem() {
  return item
}

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(12, 1)],
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
  let ctx = getContext()

  log.x('create player goat')
  item = {
    anim: anim.create(),
  }
  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    2
  )

  let sprite = item.anim.sprite
  sprite.x = 200
  sprite.y = 200
  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    sprite.tint = 0xcccccc
  })
  sprite.on('mouseout', () => {
    sprite.tint = 0xffffffff
  })

  ctx.layerUi.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  item.anim.sprite.rotation += Math.PI * elapsedTimeSec

  //_.forEach(items, (c) => {
  anim.update(item.anim, elapsedTimeSec)
  //})
}
