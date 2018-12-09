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

import * as coins from './coins'
import * as enemies from './enemies'

const isActive = true

export interface IPlayer {
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

var framesRun = [spriteUtil.frame16(1, 1)]

var animDefault: anim.IAnimData = {
  frames: framesRun,
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
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

  let sprite = ctx.createSprite('s16-512', animDefault.frames[0], 0.5, 0.5, 2)
  ctx.layerPlayer.addChild(sprite)
  item.anim.sprite = sprite
  // item.anim.sprite.x = 150
  // item.anim.sprite.y = 175
  items.push(item)

  item.x = 150
  item.y = 75

  // moveToB(item, 14, 18)

  anim.playAnim(item.anim, animDefault)

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

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

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

    anim.update(c.anim, elapsedTimeSec)

    detectCollisions_coins(c)
    detectCollisions_enemies(c)
  })
}

function checkCirclesCollide(x1, y1, r1, x2, y2, r2) {
  let dx = x2 - x1
  let dx2 = dx * dx
  let dy = y2 - y1
  let dy2 = dy * dy

  let rc = r1 + r2
  let rc2 = rc * rc

  return dx2 + dy2 < rc2
}

export function detectCollisions_coins(c: IPlayer) {
  _.forEach(coins.getAll(), (d) => {
    if (!d.isDead && !d.isCollected) {
      if (checkCirclesCollide(c.x, c.y, 16, d.x, d.y, 16)) {
        coins.doCollect(d)
      }
    }
  })
}

export function detectCollisions_enemies(c: IPlayer) {
  _.forEach(enemies.getAll(), (d) => {
    if (!d.isDead && !d.isCollected) {
      if (checkCirclesCollide(c.x, c.y, 16, d.x, d.y, 16)) {
        enemies.doCollect(d)
      }
    }
  })
}
