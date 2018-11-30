import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

import * as flightController from '../flightController'

import * as detectors from './detectors'
import * as maps from '../map/maps'

import * as coins from './coins'
import * as enemies from './enemies'

const isActive = true

export interface ITilePicker {
  anim: anim.IAnim
  bx: number
  by: number
}
let items: ITilePicker[] = []

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(1, 4, 3),
  frameTime: 10 / 60,
  loop: true,
}

export function create(container: PIXI.Container) {
  let ctx = getContext()

  log.x('create picker')
  let item: ITilePicker = {
    anim: anim.create(),
    bx: 5,
    by: 5,
  }

  let baseTex = ctx.sge.getTexture('player1')

  var tex0 = new PIXI.Texture(baseTex.baseTexture, animDefault.frames[0])
  let sprite = new PIXI.Sprite(tex0)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(1)
  container.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  moveToB(item, 5, 5)

  anim.playAnim(item.anim, animDefault)

  return item
}

export function moveToB(item: ITilePicker, bx, by) {
  item.bx = bx
  item.by = by

  item.anim.sprite.x = item.bx * 32 + 16
  item.anim.sprite.y = item.by * 32 + 16
}

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTime)
  })
}
