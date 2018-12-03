import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

import * as utils from './utils'

import * as cameras from 'engine/camera/cameras'

interface IDebris {
  anim: anim.IAnim
  vx: number
  vy: number
  tx: number
  ty: number
  lifeLeft: number
  isDead: boolean
  elapsedEjectTime: number
  type: string
  isPickedUp: boolean
  isSafe: boolean
  smoothMoveRate: number
}
let items: IDebris[] = []
export function getAll() {
  return items
}
var animSnail: anim.IAnimData = {
  frames: [spriteUtil.frame32(12, 3)],
  frameTime: 10 / 60,
}
var animCat: anim.IAnimData = {
  frames: [spriteUtil.frame32(7, 7)],
  frameTime: 10 / 60,
}
var animCatSafe: anim.IAnimData = {
  frames: spriteUtil.frame32runH(7, 5, 2),
  frameTime: 20 / 60,
}
var animDefault = animSnail

export { animSnail }

export function create() {
  let ctx = getContext()

  log.x('create goal piece')
  let item: IDebris = {
    anim: anim.create(),
    vx: _.random(-150, -50),
    vy: _.random(-50, 50),
    lifeLeft: 15,
    isDead: false,
    elapsedEjectTime: 0,
    isPickedUp: false,
    isSafe: false,
    smoothMoveRate: _.random(0.04, 0.09),
    type: '',
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
  item.anim.sprite.rotation = _.random(0, Math.PI * 2)
  ctx.layerAbove.addChild(item.anim.sprite)

  let sprite = item.anim.sprite
  sprite.interactive = true
  sprite.buttonMode = true
  let onOver = () => {
    sprite.tint = 0xcccccc
    item.isPickedUp = true
    //ctx.sfx.playGoatPickedUp()
  }
  let onOut = () => {
    sprite.tint = 0xffffffff
  }

  sprite.on('pointerdown', onOver)
  sprite.on('mouseover', onOver)
  sprite.on('mouseout', onOut)
  sprite.on('pointerupoutside', onOut)

  if (_.random() < 0.5) {
    anim.playAnim(item.anim, animSnail)
    item.type = 'snail'
  } else {
    anim.playAnim(item.anim, animCat)
    item.type = 'cat'
  }

  items.push(item)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let cv = ctx.getCameraView()
  let mouse = ctx.sge.getMouse()

  _.forEach(items, (c) => {
    c.lifeLeft -= elapsedTimeSec
    // if (c.lifeLeft < 0) {
    //   c.isDead = true
    // }

    if (utils.isOffScreen(cv, c.anim.sprite)) {
      c.isDead = true
    }

    let maxEjectTime = 2

    let baseSize = 0.25
    if (c.type === 'cat') {
      baseSize = 1
    }

    if (c.elapsedEjectTime < maxEjectTime) {
      c.elapsedEjectTime += elapsedTimeSec
      let p = c.elapsedEjectTime / maxEjectTime
      c.anim.sprite.scale.set(Math.sin(p * Math.PI) * 3 + baseSize)
    } else {
      c.anim.sprite.scale.set(baseSize)
    }

    anim.update(c.anim, elapsedTimeSec)

    if (c.isPickedUp) {
      if (c.isSafe) {
        c.anim.sprite.rotation = 0

        if (c.type === 'cat') {
          anim.playAnim(c.anim, animCatSafe)
        }
      } else {
        c.anim.sprite.rotation += Math.PI * elapsedTimeSec

        let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
        c.tx = cx
        c.ty = cy

        c.anim.sprite.x +=
          (c.tx - c.anim.sprite.x) * elapsedTimeSec * 60.0 * c.smoothMoveRate
        c.anim.sprite.y +=
          (c.ty - c.anim.sprite.y) * elapsedTimeSec * 60.0 * c.smoothMoveRate
      }
    } else {
      c.anim.sprite.rotation += Math.PI * elapsedTimeSec
      c.anim.sprite.x += c.vx * elapsedTimeSec
      c.anim.sprite.y += c.vy * elapsedTimeSec
    }
  })

  removeDead()
}

// todo genericize
export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill debris part', c)
      ctx.layerAbove.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}
