import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

import * as wallPiecesData from './wallPiecesData'
import * as utils from './utils'

export interface IWallPiece {
  animBack: anim.IAnim
  animCollison: anim.IAnim
  animFore: anim.IAnim

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
    animBack: anim.create(),
    animCollison: anim.create(),
    animFore: anim.create(),
    bx: 7,
    by: 7,
    data: wallPiecesData.DataDefault,
    isDead: false,
  }

  let sprite = ctx.createSprite('s16-512', animDefault.frames[0], 0.5, 0.5, 1)
  ctx.layerMapBack.addChild(sprite)
  item.animBack.sprite = sprite
  sprite.visible = false
  sprite = ctx.createSprite('s16-512', animDefault.frames[0], 0.5, 0.5, 1)
  ctx.layerMapCollision.addChild(sprite)
  item.animCollison.sprite = sprite
  sprite.visible = false
  sprite = ctx.createSprite('s16-512', animDefault.frames[0], 0.5, 0.5, 1)
  ctx.layerMapFore.addChild(sprite)
  item.animFore.sprite = sprite
  sprite.visible = false
  items.push(item)

  // anim.playAnim(item.anim, animDefault)

  return item
}

export function moveTo(item: IWallPiece, bx, by) {
  item.bx = bx
  item.by = by
  item.animBack.sprite.x = item.bx * 16
  item.animBack.sprite.y = item.by * 16
  item.animCollison.sprite.x = item.bx * 16
  item.animCollison.sprite.y = item.by * 16
  item.animFore.sprite.x = item.bx * 16
  item.animFore.sprite.y = item.by * 16
}

export function setData(item: IWallPiece, c: wallPiecesData.IWallPieceData) {
  item.data = c
  //   anim.setFrame(item.anim, c.frame)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  _.forEach(items, (c) => {
    anim.update(c.animBack, elapsedTimeSec)
    anim.update(c.animCollison, elapsedTimeSec)
    anim.update(c.animFore, elapsedTimeSec)
  })

  utils.removeDead(items, 'wall-piece', (c) => {
    ctx.layerMapBack.removeChild(c.animBack.sprite)
    ctx.layerMapCollision.removeChild(c.animCollison.sprite)
    ctx.layerMapFore.removeChild(c.animFore.sprite)
  })
}
