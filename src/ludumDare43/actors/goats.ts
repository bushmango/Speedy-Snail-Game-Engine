import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as cameras from 'engine/camera/cameras'

export interface IGoat {
  anim: anim.IAnim
  isFree: boolean
  isPickedUp: boolean
  tx: number
  ty: number
}
//let items: IGoat[] = []
let item: IGoat = null

export function getItem() {
  return item
}

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(12, 1)],
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
  let ctx = getContext()

  log.x('create player goat')
  item = {
    anim: anim.create(),
    isFree: true,
    isPickedUp: false,
    tx: 0,
    ty: 0,
  }
  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    1
  )

  let sprite = item.anim.sprite
  sprite.x = 200
  sprite.y = 200
  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    sprite.tint = 0xcccccc
    item.isPickedUp = true
  })
  sprite.on('mouseout', () => {
    sprite.tint = 0xffffffff
  })

  ctx.layerGoat.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)

  return item
}

export function eject() {
  item.isFree = true
  item.tx = _.random(50, 300)

  if (_.random(true) > 0.5) {
    item.ty = _.random(50, 130)
  } else {
    item.ty = _.random(220, 300)
  }

  // item.anim.sprite.x = _.random(100, 200)
  // item.anim.sprite.y = _.random(100, 200)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let mouse = ctx.sge.getMouse()
  if (item.isFree) {
    item.anim.sprite.rotation += Math.PI * elapsedTimeSec
  } else {
    item.anim.sprite.rotation = 0
  }

  if (item.isPickedUp && item.isFree) {
    let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
    item.tx = cx
    item.ty = cy
  } else {
    // part of ship
  }

  let c = item
  c.anim.sprite.x += (c.tx - c.anim.sprite.x) * 0.1 * elapsedTimeSec * 60.0
  c.anim.sprite.y += (c.ty - c.anim.sprite.y) * 0.1 * elapsedTimeSec * 60.0

  //_.forEach(items, (c) => {
  anim.update(item.anim, elapsedTimeSec)
  //})
}
