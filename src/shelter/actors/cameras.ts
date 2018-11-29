import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as stats from 'pacrpg/stats'

const isActive = true

export interface ICamera {
  container: PIXI.Container

  x: number
  y: number
  scale: number

  shakeX: number
  shakeY: number
  shakeFactor: number
  shakeFramesLeft: number
}
let items: ICamera[] = []

export function getAll() {
  return items
}

export function create() {
  let ctx = getContext()

  log.x('create camera')
  let item: ICamera = {
    container: new PIXI.Container(),
    x: 0,
    y: 0,
    scale: 2,
    shakeX: 0,
    shakeY: 0,
    shakeFactor: 0,
    shakeFramesLeft: 0,
  }
  items.push(item)

  return item
}

export function shake(c: ICamera, frames, shakeFactor) {
  if (shakeFactor >= c.shakeFactor) {
    c.shakeFactor = shakeFactor
    c.shakeFramesLeft = frames
  }
}

export function addLayer(c: ICamera, container: PIXI.Container = null) {
  if (!container) {
    container = new PIXI.Container()
  }
  c.container.addChild(container)
  return container
}

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    if (c.shakeFramesLeft > 0) {
      c.shakeFramesLeft--
      c.shakeX = _.random(-1, 1, true) * c.shakeFactor
      c.shakeY = _.random(-1, 1, true) * c.shakeFactor
    } else {
      c.shakeFactor = 0
      c.shakeX = 0
      c.shakeY = 0
    }
    c.container.position.set(c.x + c.shakeX, c.y + c.shakeY)
    c.container.scale.set(c.scale)
  })
}
