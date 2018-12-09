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
import * as players from './players'

export function players_updateMovement(c: players.IPlayer, elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

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
  // if (ox > 0) {
  //   // Test right
  //   if (!detectors.testAgainstMap(c.detectorRight, testX, testY)) {
  //     moveFailed = true
  //   }
  // }
  // if (ox < 0) {
  //   // Test right
  //   if (!detectors.testAgainstMap(c.detectorLeft, testX, testY)) {
  //     moveFailed = true
  //   }
  // }
  // if (oy < 0) {
  //   // Test right
  //   if (!detectors.testAgainstMap(c.detectorTop, testX, testY)) {
  //     moveFailed = true
  //   }
  // }
  // if (oy > 0) {
  //   // Test right
  //   if (!detectors.testAgainstMap(c.detectorBottom, testX, testY)) {
  //     moveFailed = true
  //   }
  // }

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
}
