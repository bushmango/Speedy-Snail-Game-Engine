import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { RaidContext } from './RaidContext'
import * as log from './log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as anim from '../engine/anim/anim'
import * as spriteUtil from '../engine/anim/spriteUtil'

const isActive = true

export interface IFlightController {
  timeAccum: number
  moveTime: number

  dir: number
  hasMove: boolean
}

let items: IFlightController[] = []

export function create(ctx: RaidContext) {
  let item: IFlightController = {
    timeAccum: 0,
    moveTime: 0.5,
    dir: 1,
    hasMove: false,
  }
  items.push(item)
  return item
}

import { InputControl } from 'engine/gamepad/InputControl'
export function updateAll(ctx: RaidContext) {
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    c.hasMove = false
    if (kb.isPressed(KeyCodes.arrowUp)) {
      c.dir = 0
    }
    if (kb.isPressed(KeyCodes.arrowRight)) {
      c.dir = 1
    }
    if (kb.isPressed(KeyCodes.arrowDown)) {
      c.dir = 2
    }
    if (kb.isPressed(KeyCodes.arrowLeft)) {
      c.dir = 3
    }

    c.timeAccum += elapsedTime
    if (c.timeAccum > c.moveTime) {
      c.timeAccum -= c.moveTime

      // move it!
      c.hasMove = true
    }
  })
}

export function dirToXYR(dir: number) {
  let ox = 0
  let oy = 0
  let r = 0
  switch (dir) {
    case 0:
      oy = -1
      r = Math.PI * -0.5
      break
    case 1:
      ox = 1
      r = Math.PI * 0
      break
    case 2:
      oy = 1
      r = Math.PI * 0.5
      break
    case 3:
      ox = -1
      r = Math.PI * 1
      break
  }
  return { ox, oy, r }
}
