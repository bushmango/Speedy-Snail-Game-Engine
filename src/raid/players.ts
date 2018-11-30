import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { RaidContext } from './RaidContext'
import * as log from './log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../engine/anim/spriteUtil'
import * as anim from '../engine/anim/anim'
import * as tween from '../engine/anim/tween'

import * as flightController from './flightController'

const isActive = true

interface IPlayer {
  anim: anim.IAnim

  tbx: number
  tby: number
  bx: number
  by: number

  flightController: flightController.IFlightController
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

export function create(ctx: RaidContext, container: PIXI.Container) {
  log.x('create player')
  let item: IPlayer = {
    anim: anim.create(),
    bx: 4,
    by: 4,
    tbx: 4,
    tby: 4,
    flightController: null,
  }

  let baseTex = ctx.sge.getTexture('player1')

  var texs = _.map(framesRun, (c) => new PIXI.Texture(baseTex.baseTexture, c))
  var tex0 = texs[0]

  let sprite = new PIXI.Sprite(tex0)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(4)
  container.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  anim.playAnim(item.anim, animRun)

  return item
}

export function onMove(item: IPlayer, dirX, dirY) {
  item.bx += dirX
  item.by += dirY
}

import { InputControl } from 'engine/gamepad/InputControl'
export function updateAll(ctx: RaidContext) {
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    let fc = c.flightController
    if (fc) {
      if (fc.hasMove) {
        let { ox, oy } = flightController.dirToXY(fc.moveDir)

        // c.bx = c.tbx
        // c.by = c.tby
        // c.tbx = c.bx + ox
        // c.tby = c.by + oy
        //c.bx += ox
        //c.by += oy
      }
      let r = flightController.dirToR(fc.pointDir)

      const PI2 = Math.PI * 2
      // if (c.anim.sprite.rotation < fc.springRot.target) {
      //   c.anim.sprite.rotation += (PI2 / 10) * elapsedTime
      // }
      // if (c.anim.sprite.rotation > fc.springRot.target) {
      //   c.anim.sprite.rotation -= (PI2 / 10) * elapsedTime
      // }

      c.anim.sprite.rotation = fc.springRot.cur
    }

    // lerp
    let t = fc.timeAccum / fc.moveTime
    let tq = tween.quartInOut(t)
    let easeBx = tween.lerpBounded(c.bx, c.tbx, tq)
    let easeBy = tween.lerpBounded(c.by, c.tby, tq)

    c.anim.sprite.x = 32 * 4 * easeBx - c.anim.sprite.width / 2
    c.anim.sprite.y = 32 * 4 * easeBy - c.anim.sprite.height / 2

    anim.update(c.anim, elapsedTime)
  })
}
