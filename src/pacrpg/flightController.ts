import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GameContext } from './GameContext'
import * as log from '../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as anim from '../engine/anim/anim'
import * as spriteUtil from '../engine/anim/spriteUtil'

const isActive = true

const PI2 = Math.PI * 2

export interface IFlightController {
  timeAccum: number
  moveTime: number

  pointDir: number
  moveDir: number

  hasMove: boolean
  subMove: number

  springRot: ISpring
  springX: ISpring
  springY: ISpring
}

let items: IFlightController[] = []

export interface ISpring {
  cur: number
  target: number
  k: number
  stiffness: number
  damp: number
  vel: number
  maxVel: number
}

function createSpring(val, k, stiffness, damp): ISpring {
  return {
    cur: val,
    target: val,
    k,
    stiffness,
    damp,
    vel: 0,
    maxVel: 0,
  }
}

// Hooke's law F = -kx
function updateSpring(spring: ISpring, elapsedTime) {
  let dx = (spring.target - spring.cur) * spring.stiffness
  let dir = dx < 0 ? -1 : 1
  //spring.vel += spring.k * dx * elapsedTime

  spring.vel = spring.k * dx * dx * dir

  //spring.vel -= spring.damp * spring.vel * elapsedTime
  spring.cur = spring.cur + spring.vel * elapsedTime
  // log.json(spring)
  // log.x(dx)
}
function setSpring(spring: ISpring, val) {
  spring.cur = spring.target = val
}

export function create(ctx: GameContext) {
  let item: IFlightController = {
    timeAccum: 0,
    moveTime: 0.5,
    pointDir: 1,
    moveDir: 1,
    hasMove: false,
    subMove: 0,

    springRot: createSpring(PI2 * 0.25, 0.25, PI2, 0.1),
    springX: createSpring(0, 0.5, 0.5, 0.95),
    springY: createSpring(0, 0.5, 0.5, 0.95),
  }
  items.push(item)
  return item
}

import { InputControl } from 'engine/gamepad/InputControl'
export function updateAll(ctx: GameContext) {
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    c.hasMove = false
    if (kb.isPressed(KeyCodes.arrowUp)) {
      c.pointDir = 0
    }
    if (kb.isPressed(KeyCodes.arrowRight)) {
      c.pointDir = 1
    }
    if (kb.isPressed(KeyCodes.arrowDown)) {
      c.pointDir = 2
    }
    if (kb.isPressed(KeyCodes.arrowLeft)) {
      c.pointDir = 3
    }

    c.springRot.target = dirToR(c.pointDir)
    updateSpring(c.springRot, elapsedTime)

    c.timeAccum += elapsedTime
    if (c.timeAccum > c.moveTime) {
      c.timeAccum -= c.moveTime

      // move it!
      c.moveDir = c.pointDir
      c.hasMove = true
    }
  })
}

export function dirToXY(dir: number) {
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
  return { ox, oy }
}

export function dirToR(dir: number) {
  let r = 0
  switch (dir) {
    case 0:
      r = PI2 * 0.75
      break
    case 1:
      r = PI2 * 0.0
      break
    case 2:
      r = PI2 * 0.25
      break
    case 3:
      r = PI2 * 0.5
      break
  }
  return r
}
