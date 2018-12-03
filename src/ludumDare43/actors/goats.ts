import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as cameras from 'engine/camera/cameras'
import * as soundsGeneric from 'engine/sounds/soundGeneric'

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
  frames: [spriteUtil.frame32(12, 2)],
  frameTime: 10 / 60,
}

var animEjected: anim.IAnimData = {
  frames: [spriteUtil.frame32(12, 1)],
  frameTime: 10 / 60,
}

export function create() {
  let ctx = getContext()

  log.x('create player goat')
  item = {
    anim: anim.create(),
    isFree: false,
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
  sprite.on('pointerdown', () => {
    sprite.tint = 0xcccccc
    item.isPickedUp = true
  })
  sprite.on('mouseover', () => {
    sprite.tint = 0xcccccc
    item.isPickedUp = true
  })
  // sprite.on('pointermove', () => {
  //   sprite.tint = 0xcccccc
  //   item.isPickedUp = true
  // })
  sprite.on('mouseout', () => {
    sprite.tint = 0xffffffff
  })
  sprite.on('pointerupoutside', () => {
    sprite.tint = 0xffffffff
  })

  ctx.layerGoat.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)

  eject()

  return item
}

export function eject() {
  let ctx = getContext()
  let cv = ctx.getCameraView()

  let band = cv.cameraHeight / 3
  let middle = cv.cameraHeight / 2

  if (item.isFree) {
    return
  }
  item.isFree = true
  item.tx = _.random(50, cv.cameraWidth / 2)
  item.ty = middle

  if (_.random(true) > 0.5) {
    item.ty -= 32 + _.random(32, band)
  } else {
    item.ty += 32 + _.random(32, band)
  }

  anim.playAnim(item.anim, animEjected)

  floating()

  // item.anim.sprite.x = _.random(100, 200)
  // item.anim.sprite.y = _.random(100, 200)
}

export function catchGoat() {
  let ctx = getContext()
  anim.playAnim(item.anim, animDefault)
  item.isFree = false
  item.isPickedUp = false
  ctx.sfx.playGoatRescued()
}

function floating() {
  const id = getContext().sfx.playGoatFloating(),
    sprite = soundsGeneric.getSoundSprite()

  sprite.loop(true, id).volume(1, id)

  sprite.on(
    'end',
    () => {
      let volume = sprite.volume(id) / 2
      volume = volume >= 1 / 8 ? volume : 1

      sprite.volume(volume, id)

      if (!item.isFree) {
        sprite.stop(id)
        sprite.off('end', id)
      }
    },
    id
  )
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
