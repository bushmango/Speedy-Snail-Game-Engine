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

export interface IMouseTrail {
  anim: anim.IAnim
  rate: number
}
let items: IMouseTrail[] = []

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(1, 4, 3),
  frameTime: 10 / 60,
  loop: true,
}

export function create(container: PIXI.Container) {
  let ctx = getContext()

  log.x('create picker')
  let item: IMouseTrail = {
    anim: anim.create(),
    rate: 0.1,
  }

  let baseTex = ctx.sge.getTexture('player1')

  var tex0 = new PIXI.Texture(baseTex.baseTexture, animDefault.frames[0])
  let sprite = new PIXI.Sprite(tex0)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(2)
  container.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  anim.playAnim(item.anim, animDefault)

  return item
}

export function updateAll() {
  let ctx = getContext()
  let mousePosition = ctx.sge.getMousePosition()

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTime)

    // move to mouse
    c.anim.sprite.x += (mousePosition.x - c.anim.sprite.x) * c.rate
    c.anim.sprite.y += (mousePosition.y - c.anim.sprite.y) * c.rate
  })
}
