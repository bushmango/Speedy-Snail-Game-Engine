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

export interface IRocket {
  anim: anim.IAnim
  vx: number
  vy: number
  elapsedSec: number
  isDead: boolean
  launchedFrom: shipParts.IShipPart
  type: 'rocket' | 'laser'
  isFriendlyGoatFire?: boolean
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

  if (type === 'laser') {
    ctx.sfx.playLaser()
  }

  let item: IRocket = {
    anim: anim.create(),
    vx: 150, //_.random(-150, -50),
    vy: 0,
    //vy: _.random(-50, 50),
    elapsedSec: 0,
    isDead: false,
    type: type,
    launchedFrom: null,
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
  //let kb = ctx.sge.keyboard
  let mouse = ctx.sge.getMouse()
  let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)

  _.forEach(items, (c) => {
    c.elapsedSec += elapsedTimeSec
    if (c.elapsedSec > 15) {
      c.isDead = true
    }
    anim.update(c.anim, elapsedTimeSec)
    // c.anim.sprite.rotation += Math.PI * elapsedTimeSec

    if (c.type === 'rocket') {
      let dx = c.anim.sprite.x - cx
      let dy = -(c.anim.sprite.y - cy)

      if (c.elapsedSec > 0.5) {
        if (Math.abs(dx) + Math.abs(dy) > 10) {
          //let angle = Math.atan2(cy, cx)
          let angle = -Math.atan2(dy, dx) + Math.PI
          let dAngle = angle - c.anim.sprite.rotation
          if (dAngle < -Math.PI) {
            dAngle += Math.PI * 2
          }
          if (dAngle > Math.PI) {
            dAngle -= Math.PI * 2
          }
          // log.x('dAngle', dAngle, (dAngle / Math.PI) * 180)

          let angleChange = Math.PI * 2 * elapsedTimeSec * 0.25

          if (Math.abs(dAngle) < angleChange) {
            c.anim.sprite.rotation = angle
          } else {
            if (dAngle > 0) {
              c.anim.sprite.rotation += angleChange
            } else {
              c.anim.sprite.rotation -= angleChange
            }
          }

          let rot = c.anim.sprite.rotation

          let x = 150
          let y = 0
          let xp = x * Math.cos(rot) - y * Math.sin(rot)
          let yp = y * Math.cos(rot) + x * Math.sin(rot)
          c.vx = xp
          c.vy = yp
        }
      }
    }

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
        // if (
        //   d.data.special !== 'rocket' &&
        //   d.data.special !== 'rocket-spent' &&
        //   d.data.special !== 'laser'
        // )
        if (d !== c.launchedFrom && !c.isFriendlyGoatFire) {
          getContext().sfx.playPartDestroyed()
          smash(c)
          if (d.isAttached) {
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
