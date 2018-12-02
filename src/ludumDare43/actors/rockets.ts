import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

import * as asteroids from './asteroids'
import * as utils from './utils'
import * as cameras from 'engine/camera/cameras'
import * as smashedParts from './smashedParts'
import * as shipParts from './shipParts'

interface IRocket {
  anim: anim.IAnim
  vx: number
  vy: number
  lifeLeft: number
  isDead: boolean
}
let items: IRocket[] = []
export function getAll() {
  return items
}
var animRocket: anim.IAnimData = {
  frames: spriteUtil.frame32runH(3, 5, 2),
  frameTime: 10 / 60,
  loop: true,
}
var animLaser: anim.IAnimData = {
  frames: spriteUtil.frame32runH(3, 7, 1),
  frameTime: 10 / 60,
  loop: true,
}
var animDefault = animRocket

export { animRocket }

export function create(type: 'rocket' | 'laser') {
  let ctx = getContext()

  log.x('create goal piece')
  let item: IRocket = {
    anim: anim.create(),
    vx: 150, //_.random(-150, -50),
    vy: 0,
    //vy: _.random(-50, 50),
    lifeLeft: 5,
    isDead: false,
  }

  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    1
  )
  //item.anim.sprite.rotation = _.random(0, Math.PI * 2)
  ctx.layerAbove.addChild(item.anim.sprite)
  if (type === 'rocket') {
    anim.playAnim(item.anim, animRocket)
  }
  if (type === 'laser') {
    anim.playAnim(item.anim, animLaser)
  }

  items.push(item)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    c.lifeLeft -= elapsedTimeSec
    if (c.lifeLeft < 0) {
      c.isDead = true
    }
    anim.update(c.anim, elapsedTimeSec)
    // c.anim.sprite.rotation += Math.PI * elapsedTimeSec
    c.anim.sprite.x += c.vx * elapsedTimeSec
    c.anim.sprite.y += c.vy * elapsedTimeSec

    _.forEach(asteroids.getAll(), (d) => {
      if (d.isDead) {
        return
      }
      let r = 16 - 2
      if (
        utils.checkCirclesCollide(
          c.anim.sprite.x,
          c.anim.sprite.y,
          r,
          d.anim.sprite.x,
          d.anim.sprite.y,
          r * d.data.size
        )
      ) {
        getContext().sfx.playPartDestroyed()
        smash(c)
        asteroids.smash(d)

        cameras.shake(ctx.camera, 0.25, 4)
      }
    })

    _.forEach(shipParts.getAll(), (d) => {
      if (d.isDead) {
        return
      }
      let r = 16 - 2
      if (
        utils.checkCirclesCollide(
          c.anim.sprite.x,
          c.anim.sprite.y,
          r,
          d.anim.sprite.x,
          d.anim.sprite.y,
          r
        )
      ) {
        if (
          d.data.special !== 'rocket' &&
          d.data.special !== 'rocket-spent' &&
          d.data.special !== 'laser'
        ) {
          getContext().sfx.playPartDestroyed()
          smash(c)
          if (!d.isFree) {
            shipParts.destroyFixedPiece(d)
          } else {
            shipParts.smash(d)
          }
          cameras.shake(ctx.camera, 0.25, 4)
        }
      }
    })
  })

  removeDead()
}

export function smash(c: IRocket) {
  if (!c.isDead) {
    smashedParts.create(c.anim.sprite)
    c.isDead = true
  }
}

// todo genericize
export function removeDead() {
  utils.removeDead(items, 'debris', (c) => {
    let ctx = getContext()
    ctx.layerAbove.removeChild(c.anim.sprite)
  })
}
