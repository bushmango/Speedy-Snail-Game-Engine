import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as wallPiecesData from './wallPiecesData'
import * as utils from './utils'

export interface IWallPiece {
  anim: anim.IAnim
  bx: number
  by: number
  data: wallPiecesData.IWallPieceData
  isDead: boolean
}
let items: IWallPiece[] = []

export function getAll() {
  return items
}

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame16(0, 0)],
}

export function create() {
  let ctx = getContext()

  let item: IWallPiece = {
    anim: anim.create(),
    bx: 7,
    by: 7,
    data: wallPiecesData.DataDefault,
    isDead: false,
  }

  let sprite = ctx.createSprite('s16-512', animDefault.frames[0], 0.5, 0.5, 1)
  ctx.layerMap.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  anim.playAnim(item.anim, animDefault)

  return item
}

export function moveTo(item: IWallPiece, bx, by) {
  item.bx = bx
  item.by = by
  item.anim.sprite.x = item.bx * 16
  item.anim.sprite.y = item.by * 16
}

export function setData(item: IWallPiece, c: wallPiecesData.IWallPieceData) {
  item.data = c
  anim.setFrame(item.anim, c.frame)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
  })

  utils.removeDead(items, 'wall-piece', (c) => {
    ctx.layerMap.removeChild(c.anim.sprite)
  })
}
