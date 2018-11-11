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
import * as maps from './../map/maps'

const isActive = true

interface IPlayer {
  anim: anim.IAnim

  detectorRight: detectors.IDetector
  detectorLeft: detectors.IDetector
  detectorTop: detectors.IDetector
  detectorBottom: detectors.IDetector

  tbx: number
  tby: number
  bx: number
  by: number
  x: number
  y: number

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

export function create(container: PIXI.Container) {
  let ctx = getContext()

  log.x('create player')
  let item: IPlayer = {
    anim: anim.create(),
    bx: 14,
    by: 18,
    tbx: 4,
    tby: 4,
    x: 0,
    y: 0,
    flightController: null,
    detectorRight: detectors.create(16, 0),
    detectorLeft: detectors.create(-16, 0),
    detectorTop: detectors.create(0, -16),
    detectorBottom: detectors.create(0, 16),
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

  moveToB(item, 14, 18)

  anim.playAnim(item.anim, animRun)

  return item
}

export function moveToB(item: IPlayer, bx, by) {
  item.bx = bx
  item.by = by
  item.x = item.bx * 32 + 16
  item.y = item.by * 32 + 16
  item.anim.sprite.x = item.x
  item.anim.sprite.y = item.y
}

export function onMove(item: IPlayer, dirX, dirY) {
  item.bx += dirX
  item.by += dirY
}

import { InputControl } from 'engine/gamepad/InputControl'

//export function update()

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    let fc = c.flightController
    if (fc) {
      if (fc.hasMove) {
        let { ox, oy } = flightController.dirToXY(fc.moveDir)
      }
      let r = flightController.dirToR(fc.pointDir)
      c.anim.sprite.rotation = r
    }

    // Move in our direction
    let { ox, oy } = flightController.dirToXY(fc.pointDir)

    let testX = c.x + ox
    let testY = c.y + oy

    let moveFailed = false
    if (ox > 0) {
      // Test right
      if (!detectors.testAgainstMap(c.detectorRight, testX, testY)) {
        moveFailed = true
      }
    }
    if (ox < 0) {
      // Test right
      if (!detectors.testAgainstMap(c.detectorLeft, testX, testY)) {
        moveFailed = true
      }
    }
    if (oy < 0) {
      // Test right
      if (!detectors.testAgainstMap(c.detectorTop, testX, testY)) {
        moveFailed = true
      }
    }
    if (oy > 0) {
      // Test right
      if (!detectors.testAgainstMap(c.detectorBottom, testX, testY)) {
        moveFailed = true
      }
    }

    //c.x = testX
    //c.y = testY
    if (!moveFailed) {
      c.x = testX
      c.y = testY
    }
    c.anim.sprite.x = c.x
    c.anim.sprite.y = c.y

    detectors.update(c.detectorRight, c.anim.sprite)
    detectors.update(c.detectorLeft, c.anim.sprite)
    detectors.update(c.detectorTop, c.anim.sprite)
    detectors.update(c.detectorBottom, c.anim.sprite)

    // lerp
    let t = fc.timeAccum / fc.moveTime
    let tq = tween.quartInOut(t)
    let easeBx = tween.lerpBounded(c.bx, c.tbx, tq)
    let easeBy = tween.lerpBounded(c.by, c.tby, tq)

    //c.anim.sprite.x = 32 * 4 * easeBx - c.anim.sprite.width / 2
    //c.anim.sprite.y = 32 * 4 * easeBy - c.anim.sprite.height / 2

    anim.update(c.anim, elapsedTime)
  })
}
