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

const isActive = true

interface ICoin {
  anim: anim.IAnim

  bx: number
  by: number
  x: number
  y: number
}
let items: ICoin[] = []

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(2, 3, 2),
  frameTime: 10 / 60,
  loop: true,
}
var animCollect: anim.IAnimData = {
  frames: spriteUtil.frame32runH(3, 3, 4),
  frameTime: 10 / 60,
}

export function create() {
  let ctx = getContext()

  log.x('create coin')
  let item: ICoin = {
    anim: anim.create(),
    bx: 14,
    by: 18,
    x: 0,
    y: 0,
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

export function moveToB(item: ICoin, bx, by) {
  item.bx = bx
  item.by = by
  item.x = item.bx * 32 + 16
  item.y = item.by * 32 + 16
  item.anim.sprite.x = item.x
  item.anim.sprite.y = item.y
}

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTime)
  })
}

export function drawDebug(gfx: PIXI.Graphics) {
  _.forEach(items, (c) => {
    //gfx.beginFill(0x9966ff)
    gfx.lineStyle(1, 0xff3300, 0.5)
    gfx.drawCircle(c.x, c.y, 16)
    //gfx.endFill()
    //gfx.x = c.x
    //gfx.y = c.y
  })
}
