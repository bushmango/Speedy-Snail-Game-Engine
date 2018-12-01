import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

import * as goats from './goats'

interface IHelpArrow {
  anim: anim.IAnim
  text: PIXI.extras.BitmapText
  target: any
}
//let items: IGoat[] = []
let items: IHelpArrow[] = []

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(13, 1, 3),
  frameTime: 10 / 60,
  loop: true,
}

let helpGoat: IHelpArrow = null

export function createAll() {
  helpGoat = create()
  helpGoat.text.text = 'This is you. A goat. In space.'
}

export function create() {
  let ctx = getContext()

  log.x('create help arrow goat')
  let item: IHelpArrow = {
    anim: anim.create(),
    text: null,
    target: null,
  }
  item.text = new PIXI.extras.BitmapText(`helper arrow`, {
    font: '20px defaultfont',
    align: 'left',
  })
  item.text.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(item.text)

  let sprite = ctx.createSprite('ship-001', animDefault.frames[0], 0.5, 0.5, 1)
  item.anim.sprite = sprite
  anim.playAnim(item.anim, animDefault)

  ctx.layerUi.addChild(item.anim.sprite)

  items.push(item)
  return item

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  helpGoat.target = goats.getItem().anim.sprite
  if (helpGoat.target) {
    helpGoat.anim.sprite.x = helpGoat.target.x + 32
    helpGoat.anim.sprite.y = helpGoat.target.y
    helpGoat.text.x = helpGoat.anim.sprite.x + 32
    helpGoat.text.y = helpGoat.anim.sprite.y
  } else {
  }

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
  })
}
