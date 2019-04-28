import { _ } from 'engine/importsEngine'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as smoothMoves from 'engine/anim/smoothMover'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as anim from '../../engine/anim/anim'
import * as chroma from 'chroma-js'

export interface IBackgroundPiece {
  anim: anim.IAnim
  x: number
  y: number
}

let items: IBackgroundPiece[] = []
function getAll() {
  return items
}

function create() {
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let x = cv.cameraWidth - 100
  let y = cv.cameraHeight / 2
  let item: IBackgroundPiece = {
    anim: anim.create(),
    x: x,
    y: y,
  }

  let frame = spriteUtil.frame32(1, 3)
  let sprite = ctx.createSprite('ship-001', frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  ctx.layerBelow.addChild(sprite)

  items.push(item)
  return item
}

function createAll() {
  for (let j = 0; j < 32; j++) {
    for (let i = 0; i < 32; i++) {
      let c = create()
      c.x = 32 * i
      c.y = 32 * j
    }
  }
}

function updateAll(elapsedTimeSec: number) {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  _.forEach(items, (c) => {
    c.anim.sprite.x = c.x
    c.anim.sprite.y = c.y
  })

  removeDead()
}

function removeDead() {}

export const background = {
  getAll,
  create,
  createAll,
  updateAll,
}
