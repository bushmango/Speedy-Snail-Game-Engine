import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

interface IPlayer {
  anim: anim.IAnim
}
let items: IPlayer[] = []

var framesRun = [spriteUtil.frame16(2, 2, 2, 2), spriteUtil.frame16(2, 4, 2, 2)]

var animRun: anim.IAnimData = {
  frames: framesRun,
  frameTime: 10 / 60,
  loop: true,
}
var animFall: anim.IAnimData = {
  frames: [spriteUtil.frame16(2, 6, 2, 2)],
  frameTime: 10 / 60,
}
var animDuck: anim.IAnimData = {
  frames: [spriteUtil.frame16(2, 8, 2, 2)],
  frameTime: 10 / 60,
}

export function create(container: PIXI.Container) {
  let ctx = getContext()

  log.x('create player')
  let item: IPlayer = {
    anim: anim.create(),
  }

  let baseTex = ctx.sge.getTexture('player1')

  var texs = _.map(framesRun, (c) => new PIXI.Texture(baseTex.baseTexture, c))
  var tex0 = texs[0]

  let sprite = new PIXI.Sprite(tex0)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(1)
  container.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  anim.playAnim(item.anim, animRun)

  return item
}

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTime)
  })
}
